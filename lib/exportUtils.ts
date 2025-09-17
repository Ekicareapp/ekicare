// Utilitaires pour l'export de données

export interface ExportData {
  rendezVous?: any[];
  clients?: any[];
  tournees?: any[];
}

// Export PDF (utilisant jsPDF)
export const exportToPDF = async (data: ExportData, filename: string = 'export.pdf') => {
  try {
    // Vérifier si on est côté client
    if (typeof window === 'undefined') {
      throw new Error('Export PDF non disponible côté serveur');
    }
    
    // Temporairement désactivé pour éviter les erreurs de module
    throw new Error('Export PDF temporairement désactivé');
    
    // Import dynamique de jsPDF
    // const { default: jsPDF } = await import('jspdf');
    // const doc = new jsPDF();

    // // En-tête
    // doc.setFontSize(20);
    // doc.text('Rapport Ekicare', 20, 20);

    // let yPosition = 40;

    // // Export des rendez-vous
    // if (data.rendezVous && data.rendezVous.length > 0) {
    //   doc.setFontSize(16);
    //   doc.text('Rendez-vous', 20, yPosition);
    //   yPosition += 10;

    //   doc.setFontSize(10);
    //   data.rendezVous.forEach((rdv, index) => {
    //     if (yPosition > 280) {
    //       doc.addPage();
    //       yPosition = 20;
    //     }
        
    //     doc.text(`${index + 1}. ${rdv.client?.nom || 'N/A'} - ${rdv.date}`, 20, yPosition);
    //     yPosition += 7;
    //   });
    //   yPosition += 10;
    // }

    // // Export des clients
    // if (data.clients && data.clients.length > 0) {
    //   doc.setFontSize(16);
    //   doc.text('Clients', 20, yPosition);
    //   yPosition += 10;

    //   doc.setFontSize(10);
    //   data.clients.forEach((client, index) => {
    //     if (yPosition > 280) {
    //       doc.addPage();
    //       yPosition = 20;
    //     }
        
    //     doc.text(`${index + 1}. ${client.nom} ${client.prenom} - ${client.email || 'N/A'}`, 20, yPosition);
    //     yPosition += 7;
    //   });
    // }

    // // Télécharger le PDF
    // doc.save(filename);
  } catch (error) {
    console.error('Erreur lors de l\'export PDF:', error);
    throw new Error('Impossible d\'exporter en PDF');
  }
};

// Export Excel (utilisant xlsx)
export const exportToExcel = async (data: ExportData, filename: string = 'export.xlsx') => {
  try {
    // Vérifier si on est côté client
    if (typeof window === 'undefined') {
      throw new Error('Export Excel non disponible côté serveur');
    }
    
    // Temporairement désactivé pour éviter les erreurs de module
    throw new Error('Export Excel temporairement désactivé');
    
    // Import dynamique de xlsx
    // const XLSX = await import('xlsx');
    
    // const workbook = XLSX.utils.book_new();

    // // Feuille des rendez-vous
    // if (data.rendezVous && data.rendezVous.length > 0) {
    //   const rdvData = data.rendezVous.map(rdv => ({
    //     'Date': rdv.date,
    //     'Heure': rdv.heure,
    //     'Client': rdv.client?.nom || 'N/A',
    //     'Équidé': rdv.equide?.nom || 'N/A',
    //     'Statut': rdv.statut,
    //     'Notes': rdv.notes || ''
    //   }));
      
    //   const rdvSheet = XLSX.utils.json_to_sheet(rdvData);
    //   XLSX.utils.book_append_sheet(workbook, rdvSheet, 'Rendez-vous');
    // }

    // // Feuille des clients
    // if (data.clients && data.clients.length > 0) {
    //   const clientData = data.clients.map(client => ({
    //     'Nom': client.nom,
    //     'Prénom': client.prenom,
    //     'Email': client.email || '',
    //     'Téléphone': client.telephone || '',
    //     'Adresse': client.adresse || '',
    //     'Ville': client.ville || '',
    //     'Statut': client.statut || 'actif'
    //   }));
      
    //   const clientSheet = XLSX.utils.json_to_sheet(clientData);
    //   XLSX.utils.book_append_sheet(workbook, clientSheet, 'Clients');
    // }

    // // Feuille des tournées
    // if (data.tournees && data.tournees.length > 0) {
    //   const tourneeData = data.tournees.map(tournee => ({
    //     'Nom': tournee.nom,
    //     'Date': tournee.date,
    //     'Heure début': tournee.heureDebut,
    //     'Heure fin': tournee.heureFin,
    //     'Statut': tournee.statut,
    //     'Distance': tournee.distance || '',
    //     'Durée': tournee.duree || ''
    //   }));
      
    //   const tourneeSheet = XLSX.utils.json_to_sheet(tourneeData);
    //   XLSX.utils.book_append_sheet(workbook, tourneeSheet, 'Tournées');
    // }

    // // Télécharger le fichier Excel
    // XLSX.writeFile(workbook, filename);
  } catch (error) {
    console.error('Erreur lors de l\'export Excel:', error);
    throw new Error('Impossible d\'exporter en Excel');
  }
};

// Export CSV
export const exportToCSV = (data: any[], filename: string = 'export.csv') => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Échapper les virgules et guillemets
        return typeof value === 'string' && (value.includes(',') || value.includes('"'))
          ? `"${value.replace(/"/g, '""')}"`
          : value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
