"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share2, Copy, Check, Facebook, Twitter, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  type: "song" | "playlist";
  id: string;
}

export function ShareDialog({ open, onOpenChange, title, type, id }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${type}s/${id}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link copied",
        description: "Share link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  const shareOnPlatform = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(`Check out "${title}" on AppMusic`);

    let url = "";
    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "email":
        url = `mailto:?subject=${encodedTitle}&body=${encodedUrl}`;
        break;
    }

    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">Share {type}</DialogTitle>
          <DialogDescription className="text-gray-400">
            Share "{title}" with your friends
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Copy Link */}
          <div className="space-y-2">
            <Label htmlFor="share-link" className="text-white">Link</Label>
            <div className="flex items-center gap-2">
              <Input
                id="share-link"
                value={shareUrl}
                readOnly
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Button
                type="button"
                size="icon"
                onClick={copyToClipboard}
                className="flex-shrink-0 bg-green-500 hover:bg-green-600"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="space-y-2">
            <Label className="text-white">Share on</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => shareOnPlatform("twitter")}
                className="flex-1 border-gray-700"
              >
                <Twitter className="mr-2 h-4 w-4" />
                Twitter
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => shareOnPlatform("facebook")}
                className="flex-1 border-gray-700"
              >
                <Facebook className="mr-2 h-4 w-4" />
                Facebook
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => shareOnPlatform("email")}
                className="flex-1 border-gray-700"
              >
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ShareButtonProps {
  title: string;
  type: "song" | "playlist";
  id: string;
  className?: string;
}

export function ShareButton({ title, type, id, className }: ShareButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setOpen(true)}
        className={className}
      >
        <Share2 className="h-4 w-4" />
      </Button>
      <ShareDialog
        open={open}
        onOpenChange={setOpen}
        title={title}
        type={type}
        id={id}
      />
    </>
  );
}
