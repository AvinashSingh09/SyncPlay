// Draggable Queue component for Controller
// Hybrid: Long-press on handle to drag, normal scrolling elsewhere

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    TouchSensor,
    MouseSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { usePlayer } from '../../context/PlayerContext';
import { Equalizer } from '../shared/Equalizer';
import './DraggableQueue.css';

// Sortable item component
function SortableItem({ song, index, currentIndex, isPlaying, isModified }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: song.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 100 : 'auto',
    };

    const isActive = index === currentIndex;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`queue-item ${isActive ? 'active' : ''} ${isDragging ? 'dragging' : ''}`}
        >
            {/* Handle - long press here to drag */}
            <div
                ref={setActivatorNodeRef}
                className="drag-handle"
                {...attributes}
                {...listeners}
            >
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
            </div>

            <div className="item-index">
                {isActive ? (
                    <Equalizer isPlaying={isPlaying} />
                ) : (
                    <span className="index-number">{index + 1}</span>
                )}
            </div>

            <div className="item-info">
                <span className="item-title">{song.title}</span>
                <span className="item-artist">{song.artist}</span>
            </div>

            {isModified && (
                <div className="item-modified-indicator" title="Position changed">
                    •
                </div>
            )}
        </div>
    );
}

export function DraggableQueue({ localQueue, setLocalQueue, originalQueue }) {
    const { currentIndex, isPlaying } = usePlayer();

    // Configure sensors with long press delay for touch
    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 10,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,        // 250ms long press required
                tolerance: 8,      // Allow 8px movement during delay
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = () => {
        // Drag started
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setLocalQueue((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });


        }
    };

    // Check if an item has been moved from its original position
    const isItemModified = (songId, index) => {
        const originalIndex = originalQueue.findIndex((s) => s.id === songId);
        return originalIndex !== index;
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={localQueue.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                <div className="reorderable-queue">
                    {localQueue.map((song, index) => (
                        <SortableItem
                            key={song.id}
                            song={song}
                            index={index}
                            currentIndex={currentIndex}
                            isPlaying={isPlaying}
                            isModified={isItemModified(song.id, index)}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}
