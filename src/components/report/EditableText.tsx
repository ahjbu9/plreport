import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Pencil } from 'lucide-react';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
}

export function EditableText({ value, onChange, className = '', multiline = false, placeholder = 'اكتب هنا...' }: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleBlur = () => {
    setIsEditing(false);
    if (tempValue !== value) {
      onChange(tempValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      handleBlur();
    }
    if (e.key === 'Escape') {
      setTempValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    const Component = multiline ? Textarea : Input;
    return (
      <Component
        ref={inputRef as any}
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`bg-background border-primary/30 focus:border-primary ${className}`}
        dir="rtl"
      />
    );
  }

  return (
    <span
      onClick={() => setIsEditing(true)}
      className={`group cursor-pointer inline-flex items-center gap-2 hover:bg-primary/5 rounded px-2 py-1 transition-colors ${className}`}
    >
      {value || <span className="text-muted-foreground">{placeholder}</span>}
      <Pencil className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </span>
  );
}
