      {/* Modal de création de tournée */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeCreateModal}
            />
            
            <motion.div
              className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
            >
              {/* En-tête */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-2 bg-[#F86F4D]/10 rounded-lg">
                    <PlusIcon className="w-5 h-5 text-[#F86F4D]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-semibold text-gray-900 truncate">Nouvelle tournée</h2>
                    <p className="text-sm text-gray-600 truncate">Créer une nouvelle tournée pour vos rendez-vous</p>
                  </div>
                </div>
                <button
                  onClick={closeCreateModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Contenu */}
              <div className="p-6 overflow-y-auto flex-1">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom de la tournée
                    </label>
                    <input
                      type="text"
                      value={createFormData.nom}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, nom: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                      style={{'--tw-ring-color': '#f76f4d'} as React.CSSProperties}
                      placeholder="Ex: Tournée Paris Centre"
                    />
                  </div>

                  {/* Section mode de sélection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Mode de planification
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setCreateFormData(prev => ({ ...prev, mode: 'existing' }))}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          createFormData.mode === 'existing' 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4" />
                          <span className="font-medium">RDV existants</span>
                        </div>
                        <p className="text-xs mt-1 text-left">Basé sur vos rendez-vous acceptés</p>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setCreateFormData(prev => ({ ...prev, mode: 'advance' }))}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          createFormData.mode === 'advance' 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                          </svg>
                          <span className="font-medium">Planification</span>
                        </div>
                        <p className="text-xs mt-1 text-left">Planifier à l'avance</p>
                      </button>
                    </div>
                  </div>

                  {/* Mode planification à l'avance */}
                  {createFormData.mode === 'advance' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date de la tournée
                      </label>
                      <input
                        type="date"
                        value={createFormData.date}
                        onChange={(e) => setCreateFormData(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                        style={{'--tw-ring-color': '#f76f4d'} as React.CSSProperties}
                      />
                      <p className="text-xs text-gray-500 mt-1">Sélectionnez une date pour planifier votre tournée</p>
                    </div>
                  )}

                  {/* Section sélection des clients */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      {createFormData.mode === 'existing' 
                        ? `Sélectionner les rendez-vous (${createFormData.clients.length} sélectionné${createFormData.clients.length > 1 ? 's' : ''})`
                        : `Sélectionner les clients (${createFormData.clients.length} sélectionné${createFormData.clients.length > 1 ? 's' : ''})`
                      }
                    </label>
                    
                    {/* Liste des rendez-vous acceptés */}
                    <div className="space-y-4 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
                      {mockRendezVousAcceptes.filter(rdv => {
                        const today = new Date().toISOString().split('T')[0];
                        return rdv.date === today && rdv.statut === 'accepte';
                      }).map((rdv, index) => {
                        const isSelected = createFormData.clients.some(c => c.nom === rdv.client);
                        
                        return (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${
                              isSelected 
                                ? 'bg-[#F86F4D]/10 border-[#F86F4D] shadow-sm' 
                                : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                            onClick={() => {
                              if (isSelected) {
                                // Désélectionner
                                setCreateFormData(prev => ({
                                  ...prev,
                                  clients: prev.clients.filter(c => c.nom !== rdv.client)
                                }));
                              } else {
                                // Sélectionner
                                const newClient = {
                                  nom: rdv.client,
                                  adresse: rdv.adresse,
                                  heure: rdv.heure,
                                  type: rdv.type,
                                  motif: rdv.motif || rdv.type,
                                  equide: rdv.equide,
                                  date: rdv.date
                                };
                                setCreateFormData(prev => ({
                                  ...prev,
                                  clients: [...prev.clients, newClient]
                                }));
                              }
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                  isSelected 
                                    ? 'bg-[#F86F4D] border-[#F86F4D]' 
                                    : 'border-gray-300'
                                }`}>
                                  {isSelected && (
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-medium text-gray-900">{rdv.client}</h4>
                                    <span className="text-sm text-gray-500">{rdv.heure}</span>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">{rdv.equide}</p>
                                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                    <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                    </svg>
                                    {rdv.adresse}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">{rdv.type}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* Message si aucun rendez-vous */}
                      {mockRendezVousAcceptes.filter(rdv => {
                        const today = new Date().toISOString().split('T')[0];
                        return rdv.date === today && rdv.statut === 'accepte';
                      }).length === 0 && (
                        <div className="text-center py-8">
                          <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-sm text-gray-500">Aucun rendez-vous accepté pour aujourd'hui</p>
                          <p className="text-xs text-gray-400 mt-1">Les rendez-vous acceptés apparaîtront ici</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Clients sélectionnés */}
                    {createFormData.clients.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Clients sélectionnés</h4>
                        <div className="space-y-2">
                          {createFormData.clients.map((client, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-[#F86F4D]/5 rounded-lg border border-[#F86F4D]/20">
                              <div>
                                <p className="font-medium text-gray-900">{client.nom}</p>
                                <p className="text-sm text-gray-600">{client.equide} • {client.heure}</p>
                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                  <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                  </svg>
                                  {client.adresse}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setCreateFormData(prev => ({
                                    ...prev,
                                    clients: prev.clients.filter((_, i) => i !== index)
                                  }));
                                }}
                                className="text-red-500 hover:text-red-700 text-sm"
                              >
                                Retirer
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Message informatif sur l'optimisation IA */}
                  {createFormData.clients.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        <div>
                          <p className="text-xs font-medium text-blue-800">Optimisation automatique</p>
                          <p className="text-xs text-blue-700 mt-1">
                            L'IA calculera automatiquement l'ordre optimal de visite, les heures de rendez-vous et la durée totale pour minimiser les déplacements.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={closeCreateModal}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    // TODO: Implémenter la logique de création de tournée
                    alert('Fonctionnalité de création de tournée à implémenter');
                    closeCreateModal();
                  }}
                  className="px-4 py-2 bg-[#F86F4D] text-white rounded-lg hover:bg-[#F86F4D]/90 transition-colors"
                >
                  Créer la tournée
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>



