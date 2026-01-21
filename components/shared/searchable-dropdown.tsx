'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { SearchableDropdownProps } from '@/types/searchable-dropdown'

export function SearchableDropdown({
  options = [],
  value,
  onValueChange,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search...',
  emptyText = 'No option found.',
  disabled = false,
  className,
  allowClear = true,
  loading = false,
  error = false,
  helperText,
}: SearchableDropdownProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [highlightedIndex, setHighlightedIndex] = React.useState(0)

  const inputRef = React.useRef<HTMLInputElement>(null)
  const listRef = React.useRef<HTMLDivElement>(null)

  const selectedOption = React.useMemo(
    () => options.find((option) => option._id === value),
    [options, value]
  )

  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options
    const q = searchQuery.toLowerCase()
    return options.filter((o) => o.name.toLowerCase().includes(q))
  }, [options, searchQuery])

  React.useEffect(() => {
    setHighlightedIndex(0)
  }, [filteredOptions])

  React.useEffect(() => {
    if (open) {
      // ✅ focus on input when dropdown opens
      setTimeout(() => inputRef.current?.focus(), 0)
    } else {
      // ✅ reset search when closing
      setSearchQuery('')
      setHighlightedIndex(0)
    }
  }, [open])

  const handleSelect = (id: string) => {
    onValueChange(id)
    setOpen(false)
    setSearchQuery('')
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onValueChange('')
    setSearchQuery('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (
        e.key === 'Enter' ||
        e.key === 'ArrowDown' ||
        e.key === 'ArrowUp' ||
        e.key.length === 1
      ) {
        setOpen(true)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0))
        break
      case 'Enter':
        e.preventDefault()
        if (filteredOptions[highlightedIndex] && !filteredOptions[highlightedIndex].disabled) {
          handleSelect(filteredOptions[highlightedIndex]._id)
        }
        break
      case 'Escape':
        e.preventDefault()
        setOpen(false)
        break
      case 'Tab':
        setOpen(false)
        break
    }
  }

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            onKeyDown={handleKeyDown}
            onClick={() => setOpen(true)}
            className={cn(
              'w-full justify-between transition-all duration-200',
              error && 'border-red-300 focus:border-red-500 focus:ring-red-200',
              !error && 'border-gray-300 focus:border-primary-500 focus:ring-primary-500/30',
              className
            )}
            disabled={disabled || loading}
          >
            {/* ✅ SAME FIELD USED AS SEARCH INPUT */}
            <div className="flex-1 min-w-0 text-left">
              {open ? (
                <input
                  ref={inputRef}
                  value={searchQuery}
                  placeholder={searchPlaceholder}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent border-0 p-0 outline-none text-sm"
                />
              ) : (
                <span className={cn('truncate', !value && 'text-muted-foreground')}>
                  {loading ? 'Loading...' : selectedOption ? selectedOption.name : placeholder}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 ml-2 shrink-0">
              {allowClear && value && !disabled && (
                <X
                  className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100 transition-opacity"
                  onClick={handleClear}
                />
              )}
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>

        {/* ✅ PopoverContent now ONLY shows the list (no search input here) */}
        <PopoverContent
          className="w-(--radix-popover-trigger-width) p-1"
          align="start"
          sideOffset={4}
        >
          <div ref={listRef} className="max-h-75 overflow-y-auto overflow-x-hidden">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">{emptyText}</div>
            ) : (
              filteredOptions.map((option, index) => (
                <div
                  key={option._id}
                  onClick={() => !option.disabled && handleSelect(option._id)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={cn(
                    'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors',
                    option.disabled
                      ? 'pointer-events-none opacity-50'
                      : 'hover:bg-primary-50 hover:text-primary-900',
                    value === option._id && 'bg-primary-100 text-primary-900 font-medium',
                    highlightedIndex === index && value !== option._id && 'bg-gray-100'
                  )}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4 shrink-0',
                      value === option._id ? 'opacity-100 text-primary-500' : 'opacity-0'
                    )}
                  />
                  <span className="truncate">{option.name}</span>
                </div>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>

      {helperText && (
        <p className={cn('text-xs mt-1', error ? 'text-red-600' : 'text-gray-500')}>{helperText}</p>
      )}
    </div>
  )
}
