"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SearchFilter {
  field: string;
  operator: 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'dateRange';
  value: string | { start: string; end: string };
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilter[]) => void;
  onClear: () => void;
  fields: Array<{
    key: string;
    label: string;
    type: 'text' | 'date' | 'select';
    options?: Array<{ value: string; label: string }>;
  }>;
  className?: string;
}

export default function AdvancedSearch({ 
  onSearch, 
  onClear, 
  fields, 
  className = "" 
}: AdvancedSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilter[]>([]);

  const addFilter = () => {
    setFilters(prev => [...prev, {
      field: fields[0]?.key || '',
      operator: 'contains',
      value: ''
    }]);
  };

  const updateFilter = (index: number, updates: Partial<SearchFilter>) => {
    setFilters(prev => prev.map((filter, i) => 
      i === index ? { ...filter, ...updates } : filter
    ));
  };

  const removeFilter = (index: number) => {
    setFilters(prev => prev.filter((_, i) => i !== index));
  };

  const handleSearch = () => {
    const validFilters = filters.filter(filter => 
      filter.field && filter.value && 
      (typeof filter.value === 'string' ? filter.value.trim() : true)
    );
    onSearch(validFilters);
    setIsOpen(false);
  };

  const handleClear = () => {
    setFilters([]);
    onClear();
    setIsOpen(false);
  };

  const getFieldType = (fieldKey: string) => {
    return fields.find(f => f.key === fieldKey)?.type || 'text';
  };

  const getFieldOptions = (fieldKey: string) => {
    return fields.find(f => f.key === fieldKey)?.options || [];
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <FunnelIcon className="h-4 w-4" />
        <span>Recherche avancée</span>
        {filters.length > 0 && (
          <span className="bg-[#F86F4D] text-white text-xs px-2 py-1 rounded-full">
            {filters.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Panel de recherche */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-20 p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recherche avancée</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Filtres existants */}
                {filters.map((filter, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    {/* Champ */}
                    <select
                      value={filter.field}
                      onChange={(e) => updateFilter(index, { field: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      {fields.map(field => (
                        <option key={field.key} value={field.key}>
                          {field.label}
                        </option>
                      ))}
                    </select>

                    {/* Opérateur */}
                    <select
                      value={filter.operator}
                      onChange={(e) => updateFilter(index, { operator: e.target.value as any })}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="contains">Contient</option>
                      <option value="equals">Égal à</option>
                      <option value="startsWith">Commence par</option>
                      <option value="endsWith">Finit par</option>
                      {getFieldType(filter.field) === 'date' && (
                        <option value="dateRange">Période</option>
                      )}
                    </select>

                    {/* Valeur */}
                    {filter.operator === 'dateRange' ? (
                      <div className="flex space-x-1">
                        <input
                          type="date"
                          value={typeof filter.value === 'object' ? filter.value.start : ''}
                          onChange={(e) => updateFilter(index, { 
                            value: { 
                              start: e.target.value, 
                              end: typeof filter.value === 'object' ? filter.value.end : '' 
                            }
                          })}
                          className="px-2 py-1 border border-gray-300 rounded text-xs"
                        />
                        <input
                          type="date"
                          value={typeof filter.value === 'object' ? filter.value.end : ''}
                          onChange={(e) => updateFilter(index, { 
                            value: { 
                              start: typeof filter.value === 'object' ? filter.value.start : '', 
                              end: e.target.value 
                            }
                          })}
                          className="px-2 py-1 border border-gray-300 rounded text-xs"
                        />
                      </div>
                    ) : getFieldType(filter.field) === 'select' ? (
                      <select
                        value={typeof filter.value === 'string' ? filter.value : ''}
                        onChange={(e) => updateFilter(index, { value: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="">Sélectionner...</option>
                        {getFieldOptions(filter.field).map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={getFieldType(filter.field)}
                        value={typeof filter.value === 'string' ? filter.value : ''}
                        onChange={(e) => updateFilter(index, { value: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                        placeholder="Valeur..."
                      />
                    )}

                    {/* Bouton supprimer */}
                    <button
                      onClick={() => removeFilter(index)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                {/* Bouton ajouter filtre */}
                <button
                  onClick={addFilter}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#F86F4D] hover:text-[#F86F4D] transition-colors"
                >
                  <MagnifyingGlassIcon className="h-4 w-4" />
                  <span>Ajouter un filtre</span>
                </button>

                {/* Actions */}
                <div className="flex space-x-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSearch}
                    className="flex-1 px-4 py-2 bg-[#F86F4D] text-white rounded-lg hover:bg-[#F86F4D]/90 transition-colors"
                  >
                    Rechercher
                  </button>
                  <button
                    onClick={handleClear}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Effacer
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
