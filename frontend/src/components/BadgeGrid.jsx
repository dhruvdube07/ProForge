import React, { useState } from 'react';
import { X, Plus, ArrowLeft, ArrowRight, Edit2, Sparkles } from 'lucide-react';

/**
 * BadgeGrid
 * Interactive, reorderable chip grid with inline editing, keyboard support,
 * and high-prestige typography.
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
    <div className="glass-panel p-5 rounded-2xl border border-themeBorder/80 space-y-4 transition-all duration-300">
      <div className="flex justify-between items-center pb-2.5 border-b border-themeBorder/60">
        <h3 className="text-xs font-heading font-black uppercase tracking-wider text-themePrimary flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 opacity-80" />
          {title}
        </h3>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-themePrimary/10 text-themePrimary border border-themePrimary/20">
          {items.length} item{items.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 min-h-[40px] items-center">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="group relative flex items-center gap-1.5 py-1.5 px-3 bg-themeBg/80 border border-themeBorder/80 hover:border-themePrimary/60 rounded-full text-xs text-themeText transition-all duration-200 hover:shadow-sm"
          >
            {editIndex === idx ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => saveEdit(idx)}
                onKeyDown={(e) => e.key === 'Enter' && saveEdit(idx)}
                autoFocus
                className="bg-transparent text-xs focus:outline-none w-28 text-themeText border-b border-themePrimary font-medium"
              />
            ) : (
              <span
                onClick={() => startEdit(idx, item)}
                className="cursor-pointer font-medium hover:text-themePrimary select-none flex items-center gap-1.5"
                title="Click to edit inline"
              >
                <span className="text-[9px] font-mono text-themeTextSecondary opacity-50 select-none">
                  #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                </span>
                <span>{item}</span>
                <Edit2 className="h-2.5 w-2.5 opacity-0 group-hover:opacity-60 transition-opacity text-themePrimary" />
              </span>
            )}

            {/* Reorder and Delete controls - visible on hover */}
            <div className="flex items-center gap-0.5 ml-1 pl-1 border-l border-themeBorder/60 opacity-60 group-hover:opacity-100 transition-opacity">
              {idx > 0 && (
                <button
                  type="button"
                  onClick={() => handleShiftLeft(idx)}
                  className="p-0.5 hover:text-themePrimary hover:bg-themeCard rounded transition-colors cursor-pointer"
                  title="Move left"
                >
                  <ArrowLeft className="h-3 w-3" />
                </button>
              )}
              {idx < items.length - 1 && (
                <button
                  type="button"
                  onClick={() => handleShiftRight(idx)}
                  className="p-0.5 hover:text-themePrimary hover:bg-themeCard rounded transition-colors cursor-pointer"
                  title="Move right"
                >
                  <ArrowRight className="h-3 w-3" />
                </button>
              )}
              <button
                type="button"
                onClick={() => handleDelete(idx)}
                className="p-0.5 hover:text-rose-500 hover:bg-rose-500/10 rounded transition-colors cursor-pointer"
                title="Delete item"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}

        {isAdding ? (
          <div className="flex items-center gap-1.5 py-1 px-3 bg-themeBg border border-themePrimary rounded-full ring-1 ring-themePrimary/30">
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              onBlur={handleAdd}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="Type new item..."
              autoFocus
              className="bg-transparent text-xs focus:outline-none w-28 text-themeText font-medium"
            />
            <button type="button" onClick={handleAdd} className="text-themePrimary hover:scale-110 transition-transform cursor-pointer">
              <Plus className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 py-1.5 px-3 border border-dashed border-themePrimary/60 text-themePrimary hover:bg-themePrimary hover:text-white rounded-full text-xs font-semibold transition-all duration-300 hover-lift cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Item</span>
          </button>
        )}
      </div>
    </div>
  );
}
