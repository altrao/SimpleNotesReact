"use client";

import * as React from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { Note } from "../api/notes";
import { cn } from "../lib/utils";
import { Separator } from "./ui/separator";
import { DialogTitle } from "./ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface VersionsModalProps {
  versions: Note[];
  isOpen: boolean;
  onClose: () => void;
}

export function VersionsModal({
  versions,
  isOpen,
  onClose,
}: VersionsModalProps) {
  const [selectedVersion, setSelectedVersion] = React.useState<number | null>(
    versions.length > 0 && versions[0].version !== undefined ? versions[0].version : null
  );

  const selectedVersionObject = React.useMemo(() => {
    return versions.find((v) => v.version === selectedVersion && v.version !== undefined) || null;
  }, [versions, selectedVersion]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex p-0 bg-background text-foreground">
        <VisuallyHidden>
          <DialogTitle>Note Versions</DialogTitle>
        </VisuallyHidden>
        <div className="w-1/3 border-r border-border overflow-auto bg-background">
          <div className="p-4">
            <h2 className="text-lg font-medium">Note Versions</h2>
          </div>
          <Separator />
          <div className="overflow-auto">
            {versions.map((version) => (
              <div
                key={`${version.id}-${version.version}`}
                className={cn(
                  "p-4 cursor-pointer hover:bg-muted/50",
                  selectedVersion === version.version && "bg-muted"
                )}
                onClick={() => version.version !== undefined && setSelectedVersion(version.version)}
              >
                <h3 className="text-sm font-medium">{version.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {version.createdAt
                    ? new Date(version.createdAt).toLocaleString()
                    : "No date"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Version: {version.version}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-2/3 flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-medium">
              {selectedVersionObject?.title || "Select a version"}
            </h2>
          </div>
          <div className="flex-1 p-4 overflow-auto">
            {selectedVersionObject ? (
              <div className="whitespace-pre-wrap" style={{wordWrap: "break-word"}}>
                {selectedVersionObject.content}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a version to view its content
              </div>
            )}
          </div>
          <div className="p-4 border-t border-border flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
