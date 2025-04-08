"use client";

import { Edit, History } from "lucide-react";
import * as React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

import { Note } from '../api/notes';


interface NoteDetailProps {
    note: Note | null;
    onUpdateNote: (id: string, updates: Partial<Note>) => void;
    onViewVersions: (id: string) => void;
}

export function NoteDetail({ note, onUpdateNote, onViewVersions }: NoteDetailProps) {
    const [isEditing, setIsEditing] = React.useState(false);
    const [title, setTitle] = React.useState("");
    const [content, setContent] = React.useState("");
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (note) {
            setTitle(note.title);
            setContent(note.content);
            setIsEditing(false);
            setError(null);
        }
    }, [note]);

    const handleSave = async () => {
        if (!note) return;
        setError(null);
        try {
            await onUpdateNote(note.id, { title, content });
            setIsEditing(false);
        } catch {
            setError('Failed to save - changes remain locally');
        }
    };

    if (!note) {
        return (
            <div className="flex-1 flex items-center justify-center p-8 text-muted-foreground min-w-[640px]">
                Select a note or create a new one to get started.
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full min-w-[640px] max-w-[640px]">
            <div className="flex items-center justify-between p-3 border-b border-border">
                <div className="flex-1">
                    {isEditing ? (
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="text-lg font-medium"
                            placeholder="Note title"
                        />
                    ) : (
                        <h1 className="text-lg font-medium">{note.title}</h1>
                    )}
                </div>
                <div className="w-3" />
                <div className="flex items-center gap-2">
                    {error && (
                        <span className="text-sm text-red-500">{error}</span>
                    )}
                    {isEditing ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditing(false)}
                            className="h-10 w-15"
                        >
                            Cancel
                        </Button>
                    ) : (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onViewVersions(note.id);
                            }}
                            className="h-10 w-12"
                        >
                            <History className="h-8 w-8" />
                            <span className="sr-only">View versions</span>
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            if (isEditing) {
                                handleSave();
                            } else {
                                setIsEditing(true);
                            }
                        }}
                        className="h-10 w-12"
                    >
                        {isEditing ? (
                            "Save"
                        ) : (
                            <>
                                <Edit className="h-8 w-6" />
                                <span className="sr-only">Edit note</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="flex-1 p-4 overflow-auto">
                {isEditing ? (
                    <div className="space-y-2">
                        <Textarea
                            value={content}
                            onChange={(e) => {
                                if (e.target.value.length <= 240) {
                                    setContent(e.target.value);
                                }
                            }}
                            className="min-h-[473px] resize-none"
                            placeholder="Note content"
                        />
                        <div className="text-right text-sm text-muted-foreground">
                            {content.length}/240 characters
                        </div>
                    </div>
                ) : (
                    <div className="whitespace-pre-wrap" style={{ overflowWrap: "break-word" }}>{note.content}</div>
                )}
            </div>
        </div>
    );
}
