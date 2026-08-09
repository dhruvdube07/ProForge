import React, { useState } from 'react';
import { X, Plus, ArrowLeft, ArrowRight, Edit2 } from 'lucide-react';

/**
 * Renders an editable, reorderable grid of badges for a specific profile section.
 */
export default function BadgeGrid({ title, items = [], onChange }) {
  const [editIndex, setEditIndex] = useState(-1);
  const [editValue, setEditValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newValue, setNewValue] = useState('');

  // Delete item
  const handleDelete = (indexToDelete) => {
    const updated = items.filter((_, idx) => idx !== indexToDelete);
    onChange(updated);
  };

  // Reorder items: shift left
  const handleShiftLeft = (index) => {
    if (index === 0) return;
    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    onChange(updated);
  };

  // Reorder items: shift right
  const handleShiftRight = (index) => {
    if (index === items.length - 1) return;
    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    onChange(updated);
  };

  // Start editing a badge
  const startEdit = (index, value) => {
    setEditIndex(index);
    setEditValue(value);
  };

  // Save edited badge
  const saveEdit = (index) => {
    if (!editValue.trim()) {
      handleDelete(index);
    } else {
      const updated = [...items];
      updated[index] = editValue.trim();
      onChange(updated);
    }
    setEditIndex(-1);
  };

  // Add new badge
  const handleAdd = () => {
    if (newValue.trim()) {
      const updated = [...items, newValue.trim()];
      onChange(updated);
      setNewValue('');
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-themeCard border border-themeBorder p-5 rounded-theme space-y-4 transition-all duration-300">
      <div className="flex justify-between items-center pb-2 border-b border-themeBorder">
        <h3 className="text-sm font-bold uppercase tracking-wider text-themePrimary">
          {title}
        </h3>
        <span className="text-xs text-themeTextSecondary">
          {items.length} item{items.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5 min-h-[40px]">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="group relative flex items-center gap-1.5 py-1.5 px-3 bg-themeBg border border-themeBorder hover:border-themePrimaryLight rounded-full text-sm text-themeText transition-all duration-200"
          >
            {editIndex === idx ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => saveEdit(idx)}
                onKeyDown={(e) => e.key === 'Enter' && saveEdit(idx)}
                autoFocus
                className="bg-transparent text-sm focus:outline-none w-24 text-themeText border-b border-themePrimary font-medium"
              />
            ) : (
              <span
                onClick={() => startEdit(idx, item)}
                className="cursor-pointer font-medium hover:text-themePrimary select-none flex items-center gap-1"
                title="Click to edit inline"
              >
                {item}
                <Edit2 className="h-2.5 w-2.5 opacity-0 group-hover:opacity-60 transition-opacity" />
              </span>
            )}

            {/* Reorder and Delete controls - visible on hover */}
            <div className="flex items-center gap-0.5 ml-1 pl-1 border-l border-themeBorder">
              {idx > 0 && (
                <button
                  onClick={() => handleShiftLeft(idx)}
                  className="p-0.5 hover:text-themePrimary hover:bg-themeCard rounded transition-colors"
                  title="Move left"
                >
                  <ArrowLeft className="h-3 w-3" />
                </button>
              )}
              {idx < items.length - 1 && (
                <button
                  onClick={() => handleShiftRight(idx)}
                  className="p-0.5 hover:text-themePrimary hover:bg-themeCard rounded transition-colors"
                  title="Move right"
                >
                  <ArrowRight className="h-3 w-3" />
                </button>
              )}
              <button
                onClick={() => handleDelete(idx)}
                className="p-0.5 hover:text-red-500 hover:bg-themeCard rounded transition-colors"
                title="Delete item"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}

        {isAdding ? (
          <div className="flex items-center gap-1.5 py-1 px-2.5 bg-themeBg border border-themePrimaryLight rounded-full">
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              onBlur={handleAdd}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="New item..."
              autoFocus
              className="bg-transparent text-sm focus:outline-none w-24 text-themeText font-medium"
            />
            <button onClick={handleAdd} className="text-themePrimary">
              <Plus className="h-4.5 w-4.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 py-1.5 px-3 border border-dashed border-themePrimary text-themePrimary hover:bg-themePrimary hover:text-white rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Add New
          </button>
        )}
      </div>
    </div>
  );
}
