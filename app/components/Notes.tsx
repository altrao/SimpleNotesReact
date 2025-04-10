"use client";

import * as React from "react";
import { Note, createNote, deleteNote, getDeletedNotes, getNoteVersions, getNotes, updateNote } from '../api/notes';
import { NoteDetail } from "./NoteDetail";
import { NoteList } from "./NoteList";
import { Card } from "./ui/card";
import { VersionsModal } from './VersionsModal';
import { ModalType } from "./VersionsModal";


interface LocalNote extends Note { }

interface NotesProps {
    authExpired: () => void
}

const ModalTypes = {
    Versions: { listTitle: "Notes versions", headerTitle: "Select a version", description: "Select a version to see its content" } as ModalType,
    Deleted: { listTitle: "Deleted notes", headerTitle: "Select a note", description: "Select a note to see its content" } as ModalType
}

export function Notes({ authExpired }: NotesProps) {
    const [notes, setNotes] = React.useState<LocalNote[]>([]);
    const [selectedNoteId, setSelectedNoteId] = React.useState<string | null>(null);
    const [showModal, setShowModal] = React.useState(false);
    const [modalNotes, setModalNotes] = React.useState<Note[]>([]);
    const [modalType, setModalType] = React.useState<ModalType>(ModalTypes.Versions)

    const selectedNote = React.useMemo(() => {
        return notes.find((note) => note.id === selectedNoteId) || null;
    }, [notes, selectedNoteId]);

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

    const handleAddNote = async (ttl?: number) => {
        try {
            const newNote = await createNote({
                title: "New Note",
                content: "",
                ttl: ttl || undefined
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

    const handleViewVersions = async (id: string) => {
        try {
            const fetchedVersions = await getNoteVersions(id);

            setModalType(ModalTypes.Versions)
            setModalNotes(fetchedVersions);
            setShowModal(true);
        } catch (error) {
            checkAuthExpired(error)
        }
    };

    const handleViewDeleted = async () => {
        try {
            const deletedNotes = await getDeletedNotes()

            setModalType(ModalTypes.Deleted)
            setModalNotes(deletedNotes)
            setShowModal(true)
        } catch (error) {
            checkAuthExpired(error);
        }
    };

    return (
        <Card className="flex h-[600px] w-[900px] overflow-visible">
            <NoteList
                notes={notes}
                selectedNoteId={selectedNoteId}
                onSelectNote={setSelectedNoteId}
                onDeleteNote={handleDeleteNote}
                onAddNote={handleAddNote}
                onViewDeleted={handleViewDeleted}
            />
            <NoteDetail
                note={selectedNote}
                onUpdateNote={handleUpdateNote}
                onViewVersions={handleViewVersions}
            />
            <VersionsModal
                type={modalType}
                versions={modalNotes}
                isOpen={showModal}
                onClose={() => setShowModal(false)}
            />
        </Card>
    );
}
