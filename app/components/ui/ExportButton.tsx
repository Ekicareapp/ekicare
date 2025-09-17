"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownTrayIcon, DocumentArrowDownIcon, TableCellsIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { exportToPDF, exportToExcel, exportToCSV, ExportData } from '@/lib/exportUtils';
import { useNotifications } from './Notification';

interface ExportButtonProps {
  data: ExportData;
  filename?: string;
  className?: string;
}

export default function ExportButton({ 
  data, 
  filename = 'export', 
  className = "" 
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const { showSuccess, showError } = useNotifications();

  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    setIsExporting(true);
    
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const fullFilename = `${filename}_${timestamp}`;

      switch (format) {
        case 'pdf':
          await exportToPDF(data, `${fullFilename}.pdf`);
          break;
        case 'excel':
          await exportToExcel(data, `${fullFilename}.xlsx`);
          break;
        case 'csv':
          // Pour CSV, on exporte seulement les rendez-vous pour l'instant
          if (data.rendezVous && data.rendezVous.length > 0) {
            exportToCSV(data.rendezVous, `${fullFilename}.csv`);
          } else {
            throw new Error('Aucune donnée à exporter');
          }
          break;
      }

      showSuccess('Export réussi', `Les données ont été exportées en ${format.toUpperCase()}`);
      setShowOptions(false);
    } catch (error) {
      console.error('Erreur export:', error);
      showError('Erreur d\'export', 'Impossible d\'exporter les données');
    } finally {
      setIsExporting(false);
    }
  };

  const hasData = (data.rendezVous && data.rendezVous.length > 0) || 
                  (data.clients && data.clients.length > 0) || 
                  (data.tournees && data.tournees.length > 0);

  if (!hasData) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowOptions(!showOptions)}
        disabled={isExporting}
        className={`
          flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
          ${isExporting 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : 'bg-[#F86F4D] text-white hover:bg-[#F86F4D]/90'
          }
        `}
      >
        <ArrowDownTrayIcon className="h-4 w-4" />
        <span>{isExporting ? 'Export...' : 'Exporter'}</span>
      </button>

      {showOptions && (
        <>
          {/* Overlay pour fermer */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowOptions(false)}
          />
          
          {/* Menu d'options */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20"
          >
            <div className="py-2">
              <button
                onClick={() => handleExport('pdf')}
                disabled={isExporting}
                className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors"
              >
                <DocumentTextIcon className="h-5 w-5 text-red-500" />
                <span>Export PDF</span>
              </button>
              
              <button
                onClick={() => handleExport('excel')}
                disabled={isExporting}
                className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors"
              >
                <TableCellsIcon className="h-5 w-5 text-green-500" />
                <span>Export Excel</span>
              </button>
              
              <button
                onClick={() => handleExport('csv')}
                disabled={isExporting}
                className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors"
              >
                <DocumentArrowDownIcon className="h-5 w-5 text-blue-500" />
                <span>Export CSV</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
