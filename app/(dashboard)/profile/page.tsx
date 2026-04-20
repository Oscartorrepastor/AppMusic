"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { Globe, Loader2, Save, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useToast } from "@/hooks/use-toast";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  createdAt: string;
}

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const { t, i18n } = useTranslation();
  const { toast } = useToast();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || t("profile.loadError"));
        }

        setProfile(data);
        setName(data.name || "");
        setAvatar(data.avatar || "");
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: t("favorites.errorTitle"),
          description: error instanceof Error ? error.message : t("profile.loadError"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [t, toast]);

  const initials = useMemo(() => {
    const sourceName = name || session?.user?.name || "User";
    return sourceName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [name, session?.user?.name]);

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString(i18n.language, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-";

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: t("favorites.errorTitle"),
        description: t("profile.passwordMismatch"),
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          avatar,
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("favorites.errorDescription"));
      }

      setProfile(data.user);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      await update({
        user: {
          ...session?.user,
          name: data.user.name,
          avatar: data.user.avatar,
        },
      });

      toast({
        title: t("profile.successTitle"),
        description: t("profile.successDescription"),
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: t("favorites.errorTitle"),
        description: error instanceof Error ? error.message : t("favorites.errorDescription"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center text-slate-300">{t("common.loading")}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-white/5 bg-[linear-gradient(135deg,rgba(34,211,238,0.16),rgba(217,70,239,0.12),rgba(255,255,255,0.02))] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <h1 className="text-4xl font-bold text-white">{t("profile.title")}</h1>
        <p className="mt-2 text-slate-300">{t("profile.subtitle")}</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <UserRound className="h-5 w-5 text-cyan-300" />
              {t("profile.basicInfo")}
            </CardTitle>
            <CardDescription className="text-slate-300">{t("profile.standardAccount")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-3 text-center">
              <Avatar className="h-24 w-24 border border-white/10">
                {avatar ? <AvatarImage src={avatar} alt={name || session?.user?.name || "User"} /> : null}
                <AvatarFallback className="bg-gradient-to-br from-cyan-300 to-fuchsia-400 text-xl font-semibold text-slate-950">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-semibold text-white">{name || session?.user?.name}</p>
                <p className="text-sm text-slate-300">{profile?.email || session?.user?.email}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-sm text-slate-300">
              <p className="font-medium text-white">{t("profile.memberSince")}</p>
              <p className="mt-1">{memberSince}</p>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSave} className="space-y-6">
          <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">{t("profile.basicInfo")}</CardTitle>
              <CardDescription className="text-slate-300">{t("profile.emailReadOnly")}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="name" className="text-slate-200">{t("profile.displayName")}</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-white/10 bg-white/5 text-white"
                />
              </div>

              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="email" className="text-slate-200">{t("profile.email")}</Label>
                <Input
                  id="email"
                  value={profile?.email || session?.user?.email || ""}
                  disabled
                  className="border-white/10 bg-slate-900/60 text-slate-300"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="avatar" className="text-slate-200">{t("profile.avatarUrl")}</Label>
                <Input
                  id="avatar"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder={t("profile.avatarPlaceholder")}
                  className="border-white/10 bg-white/5 text-white placeholder:text-slate-500"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Globe className="h-5 w-5 text-cyan-300" />
                  {t("profile.preferences")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-slate-300">{t("common.language")}</p>
                <LanguageSwitcher />
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <ShieldCheck className="h-5 w-5 text-fuchsia-300" />
                  {t("profile.security")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-slate-200">{t("profile.currentPassword")}</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="border-white/10 bg-white/5 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-slate-200">{t("profile.newPassword")}</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border-white/10 bg-white/5 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-200">{t("profile.confirmPassword")}</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-white/10 bg-white/5 text-white"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-gradient-to-r from-cyan-300 to-fuchsia-400 text-slate-950 hover:opacity-95"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isSaving ? t("profile.saving") : t("profile.save")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
