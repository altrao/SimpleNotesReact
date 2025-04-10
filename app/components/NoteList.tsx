"use client";

import { motion } from "framer-motion";
import { Plus, Trash, Clock } from "lucide-react";
import { useState } from "react";
import { TemporaryNoteModal } from "./TemporaryNoteModal";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

import { Note } from '../api/notes';

interface NoteListProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
  onAddNote: (ttl?: number) => void;
  onViewDeleted: () => void;
}

export function NoteList({
  notes,
  selectedNoteId,
  onSelectNote,
  onDeleteNote,
  onAddNote,
  onViewDeleted,
}: NoteListProps) {
  const [showTempNoteModal, setShowTempNoteModal] = useState(false);

  return (
    <>
      <TemporaryNoteModal
        open={showTempNoteModal}
        onOpenChange={setShowTempNoteModal}
        onSubmit={(ttl) => onAddNote(ttl)}
      />
      <div className="w-full md:w-64 h-full flex flex-col border-r border-border">
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-lg font-medium">Notes</h2>
        <div className="flex gap-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onViewDeleted();
            }}
            className="h-8 w-11"
          >
            <Trash className="h-10 w-10" />
            <span className="sr-only">View deleted notes</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowTempNoteModal(true);
            }}
            className="h-8 w-11"
          >
            <Clock className="h-8 w-10" />
            <span className="sr-only">Create temporary note</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddNote();
            }}
            className="h-8 w-12"
          >
            <Plus className="h-8 w-10" />
            <span className="sr-only">Add note</span>
          </Button>
        </div>
      </div>
      <Separator />

      <div className="flex-1 overflow-visible">
        {notes.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No notes yet. Create one to get started.
          </div>
        ) : (
          <ul className="py-2">
            {notes.map((note) => (
              <motion.li
                key={note.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div
                  className={cn(
                    "flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-muted/50",
                    selectedNoteId === note.id && "bg-muted"
                  )}
                  onClick={() => onSelectNote(note.id)}
                >
                  <div className="flex-1 truncate">
                    <h3 className="text-sm font-medium">{note.title}</h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 'No date'}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteNote(note.id);
                    }}
                  >
                    <Trash className="h-10 w-12" />
                    <span className="sr-only">Delete note</span>
                  </Button>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
    </>
  );
}
