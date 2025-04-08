"use client";

import * as React from "react";
import { Note, createNote, deleteNote, getNoteVersions, getNotes, updateNote } from '../api/notes';
import { NoteDetail } from "./NoteDetail";
import { NoteList } from "./NoteList";
import { Card } from "./ui/card";
import { VersionsModal } from './VersionsModal';

interface LocalNote extends Note { }

interface NotesProps {
    authExpired: () => void
}

export function Notes({ authExpired }: NotesProps) {
    const [notes, setNotes] = React.useState<LocalNote[]>([]);
    const [selectedNoteId, setSelectedNoteId] = React.useState<string | null>(null);

    const checkAuthExpired = (error: any) => {
        if (error instanceof Error && error.cause === 401) {
            authExpired()
        }
    }

    React.useEffect(() => {
        const fetchNotes = async () => {
            try {
                const apiNotes = await getNotes();

                setNotes(apiNotes.map(note => ({
                    ...note,
                    id: note.id.toString(),
                    createdAt: note.createdAt || new Date().toISOString()
                })));
                if (apiNotes.length > 0 && !selectedNoteId) {
                    setSelectedNoteId(apiNotes[0].id.toString());
                }
            } catch (error) {
                checkAuthExpired(error)
            }
        };

        fetchNotes();
    }, []);

    const selectedNote = React.useMemo(() => {
        return notes.find((note) => note.id === selectedNoteId) || null;
    }, [notes, selectedNoteId]);

    const handleAddNote = async () => {
        try {
            const newNote = await createNote({
                title: "New Note",
                content: ""
            });

            setNotes([{
                ...newNote,
                id: newNote.id.toString(),
                createdAt: newNote.createdAt || new Date().toISOString()
            }, ...notes]);

            setSelectedNoteId(newNote.id.toString());
        } catch (error) {
            checkAuthExpired(error)
        }
    };

    const handleDeleteNote = async (id: string) => {
        try {
            await deleteNote(id);

            setNotes(notes.filter((note) => note.id !== id));

            if (selectedNoteId === id) {
                setSelectedNoteId(notes.length > 1 ? notes[0].id : null);
            }
        } catch (error) {
            checkAuthExpired(error)
        }
    };

    const handleUpdateNote = async (id: string, updates: Partial<Note>) => {
        setNotes(notes.map(note =>
            note.id === id ? {
                ...note,
                ...updates,
                updatedAt: new Date().toISOString()
            } : note
        ));

        try {
            await updateNote(id, {
                title: updates.title || '',
                content: updates.content || ''
            });
        } catch (error) {
            checkAuthExpired(error)
        }
    };

    const [showVersions, setShowVersions] = React.useState(false);
    const [versions, setVersions] = React.useState<Note[]>([]);

    const handleViewVersions = async (id: string) => {
        try {
            const fetchedVersions = await getNoteVersions(id);

            setVersions(fetchedVersions);
            setShowVersions(true);
        } catch (error) {
            checkAuthExpired(error)
        }
    };

    return (
        <Card className="flex h-[600px] overflow-hidden">
            <NoteList
                notes={notes}
                selectedNoteId={selectedNoteId}
                onSelectNote={setSelectedNoteId}
                onDeleteNote={handleDeleteNote}
                onAddNote={handleAddNote}
            />
            <NoteDetail
                note={selectedNote}
                onUpdateNote={handleUpdateNote}
                onViewVersions={handleViewVersions}
            />
            <VersionsModal
                versions={versions}
                isOpen={showVersions}
                onClose={() => setShowVersions(false)}
            />
        </Card>
    );
}
