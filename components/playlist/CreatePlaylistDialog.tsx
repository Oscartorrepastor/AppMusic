"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface CreatePlaylistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePlaylistDialog({
  open,
  onOpenChange,
}: CreatePlaylistDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: t("playlistDialog.errorTitle"),
        description: t("playlistDialog.enterName"),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/playlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
          isPublic: false,
        }),
      });

      if (!response.ok) {
        throw new Error(t("playlistDialog.createError"));
      }

      const playlist = await response.json();

      toast({
        title: t("playlistDialog.successTitle"),
        description: t("playlistDialog.successDescription"),
      });

      setName("");
      setDescription("");
      onOpenChange(false);
      router.push(`/playlists/${playlist.id}`);
      router.refresh();
    } catch (error) {
      console.error("Error creating playlist:", error);
      toast({
        title: t("playlistDialog.errorTitle"),
        description: t("playlistDialog.createError"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-gray-800 bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle>{t("playlistDialog.title")}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {t("playlistDialog.description")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("playlistDialog.name")}</Label>
              <Input
                id="name"
                placeholder={t("playlistDialog.namePlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                className="border-gray-700 bg-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t("playlistDialog.descriptionLabel")}</Label>
              <Textarea
                id="description"
                placeholder={t("playlistDialog.descriptionPlaceholder")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
                className="border-gray-700 bg-gray-800"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              {t("playlistDialog.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-emerald-500 text-black hover:bg-emerald-400"
            >
              {isLoading ? t("playlistDialog.creating") : t("playlistDialog.create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
