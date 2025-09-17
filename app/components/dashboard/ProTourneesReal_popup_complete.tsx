      {/* Popup de détails */}
      <AnimatePresence>
        {isModalOpen && selectedTournee && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeModal}
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
                    <MapIcon className="w-5 h-5 text-[#F86F4D]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-semibold text-gray-900 truncate">
                      {selectedTournee.nom}
                    </h2>
                    <p className="text-sm text-gray-600 truncate">
                      {new Date(selectedTournee.date).toLocaleDateString('fr-FR', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })} • {selectedTournee.heureDebut} - {selectedTournee.heureFin}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Contenu */}
              <div className="p-6 overflow-y-auto flex-1">
                <div className="space-y-6">
                  {/* Informations générales */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg border border-[#1B263B]/10">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#F86F4D]/10 rounded-lg">
                          <UserIcon className="h-4 w-4 text-[#F86F4D]" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-[#1B263B]/70 uppercase tracking-wide">Clients</p>
                          <p className="text-sm font-bold text-[#1B263B]">{selectedTournee.clients?.length || 0}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg border border-[#1B263B]/10">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#F86F4D]/10 rounded-lg">
                          <MapPinIcon className="h-4 w-4 text-[#F86F4D]" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-[#1B263B]/70 uppercase tracking-wide">Distance</p>
                          <p className="text-sm font-bold text-[#1B263B]">{selectedTournee.distance}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg border border-[#1B263B]/10">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#F86F4D]/10 rounded-lg">
                          <ClockIcon className="h-4 w-4 text-[#F86F4D]" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-[#1B263B]/70 uppercase tracking-wide">Durée</p>
                          <p className="text-sm font-bold text-[#1B263B]">{selectedTournee.duree}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Détails des rendez-vous */}
                  {selectedTournee.clients && selectedTournee.clients.length > 0 && (
                    <div>
                      <h3 className="font-medium text-[#1B263B] mb-4">Détails des rendez-vous</h3>
                      <div className="space-y-4">
                        {selectedTournee.clients.map((client: any, index: number) => {
                          const isActive = selectedTournee.statut === 'en_cours' && index === 0;
                          const isCompleted = selectedTournee.statut === 'en_cours' && index > 0;
                          const isFinished = selectedTournee.statut === 'terminee' || (selectedTournee.statut === 'en_cours' && index < 0);
                          const isCurrent = selectedTournee.statut === 'planifiee' && index === 0; // Première tournée planifiée
                          
                          return (
                            <div key={index} className="relative">
                              {/* Ligne de connexion */}
                              {index < selectedTournee.clients.length - 1 && (
                                <div className={`absolute left-6 top-16 w-0.5 h-12 ${
                                  isActive ? 'bg-orange-300' : isCurrent ? 'bg-blue-300' : 'bg-gray-300'
                                }`} />
                              )}
                              
                              {/* Cercle de statut */}
                              <div className="flex items-start gap-4">
                                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm ${
                                  isActive 
                                    ? 'bg-orange-500 text-white ring-4 ring-orange-100' 
                                    : isCurrent
                                    ? 'bg-blue-50 text-blue-600 ring-2 ring-blue-100'
                                    : isCompleted || isFinished
                                    ? 'bg-gray-50 text-[#1B263B]'
                                    : 'bg-gray-50 text-[#1B263B]/70'
                                }`}>
                                  {index + 1}
                                </div>
                                
                                {/* Contenu du client */}
                                <div className={`flex-1 rounded-lg p-4 transition-all border ${
                                  isActive 
                                    ? 'bg-orange-50 border-orange-200 shadow-md' 
                                    : isCurrent
                                    ? 'bg-blue-50 border-blue-200 shadow-sm'
                                    : isCompleted || isFinished
                                    ? 'bg-gray-50 border-[#1B263B]/10'
                                    : 'bg-gray-50 border-[#1B263B]/10'
                                }`}>
                                  <div className="flex items-center justify-between mb-3">
                                    <h4 className={`font-medium ${
                                      isActive ? 'text-orange-700' : isCurrent ? 'text-blue-700' : (isCompleted || isFinished) ? 'text-[#1B263B]' : 'text-[#1B263B]'
                                    }`}>
                                      {client.nom}
                                    </h4>
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                      isActive 
                                        ? 'bg-orange-100 text-orange-700' 
                                        : isCurrent
                                        ? 'bg-blue-100 text-blue-700'
                                        : (isCompleted || isFinished)
                                        ? 'bg-[#1B263B]/10 text-[#1B263B]'
                                        : 'bg-[#1B263B]/10 text-[#1B263B]'
                                    }`}>
                                      {client.heure}
                                    </span>
                                  </div>

                                  <div className="space-y-2">
                                    <div className="flex items-start gap-2">
                                      <MapPinIcon className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                      <p className={`text-sm ${
                                        isActive ? 'text-orange-600' : (isCompleted || isFinished) ? 'text-[#1B263B]/70' : 'text-[#1B263B]/70'
                                      }`}>
                                        {client.adresse}
                                      </p>
                                      <button
                                        onClick={() => navigator.clipboard.writeText(client.adresse)}
                                        className="ml-1 p-1 hover:bg-gray-100 rounded transition-colors"
                                        title="Copier l'adresse"
                                      >
                                        <svg className="w-3 h-3 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                      </button>
                                    </div>
                                    
                                    <div className="flex items-start gap-2">
                                      <CalendarIcon className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                      <p className={`text-sm ${
                                        isActive ? 'text-orange-600' : (isCompleted || isFinished) ? 'text-[#1B263B]/70' : 'text-[#1B263B]/70'
                                      }`}>
                                        {client.motif || client.type || 'Consultation générale'}
                                      </p>
                                    </div>
                                    
                                    <div className="flex items-start gap-2">
                                      <UserIcon className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                      <p className={`text-sm ${
                                        isActive ? 'text-orange-600' : (isCompleted || isFinished) ? 'text-[#1B263B]/70' : 'text-[#1B263B]/70'
                                      }`}>
                                        {client.equide || 'Équidé non spécifié'}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  {/* Badge de statut */}
                                  {isActive && (
                                    <div className="mt-3 inline-flex items-center gap-2 px-2 py-1 bg-orange-100 rounded-full">
                                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                                      <span className="text-xs font-medium text-orange-700">
                                        En cours
                                      </span>
                                    </div>
                                  )}
                                  {(isCompleted || isFinished) && (
                                    <div className="mt-3 inline-flex items-center gap-2 px-2 py-1 bg-[#1B263B]/10 rounded-full">
                                      <svg className="w-3 h-3 text-[#1B263B]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                      <span className="text-xs font-medium text-[#1B263B]">
                                        Terminé
                                      </span>
                                    </div>
                                  )}
                                  {isActive && (
                                    <div className="mt-3">
                                      <button
                                        onClick={() => {
                                          // Marquer le rendez-vous comme terminé et passer au suivant
                                          alert(`Rendez-vous avec ${client.nom} terminé ! Passage au suivant.`);
                                          // TODO: Implémenter la logique de mise à jour
                                        }}
                                        className="px-4 py-2 bg-[#F86F4D] hover:bg-[#F86F4D]/90 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                                      >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Terminer et passer au suivant
                                      </button>
                                    </div>
                                  )}
                                  
                                  {isCurrent && (
                                    <div className="mt-3">
                                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg border border-blue-200">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                        Prochaine étape
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Informations IA pour les suggestions */}
                  {selectedTournee.statut === 'suggestion' && (
                    <div className="bg-white border border-[#1B263B]/10 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-[#F86F4D]/10 rounded-lg">
                            <SparklesIcon className="h-6 w-6 text-[#F86F4D]" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-[#1B263B]">Suggestion IA</h3>
                            <p className="text-sm text-[#1B263B]/70">Optimisation automatique</p>
                          </div>
                        </div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F86F4D]/10 rounded-full">
                          <div className="w-2 h-2 bg-[#F86F4D] rounded-full"></div>
                          <span className="text-sm font-medium text-[#1B263B]">
                            {selectedTournee.score}% d'efficacité
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="p-3 bg-gray-50 rounded-lg border border-[#1B263B]/10">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <ClockIcon className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-[#1B263B]/70 uppercase tracking-wide">Temps gagné</p>
                              <p className="text-sm font-bold text-[#1B263B]">{selectedTournee.economie}</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg border border-[#1B263B]/10">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <MapPinIcon className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-[#1B263B]/70 uppercase tracking-wide">Distance</p>
                              <p className="text-sm font-bold text-[#1B263B]">{selectedTournee.distance}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg border border-[#1B263B]/10">
                        <div className="flex items-start gap-3">
                          <div className="p-1.5 bg-[#F86F4D]/10 rounded-lg mt-0.5">
                            <svg className="w-4 h-4 text-[#F86F4D]" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium text-[#1B263B] mb-2">Optimisation intelligente</h4>
                            <p className="text-sm text-[#1B263B]/70 leading-relaxed mb-3">
                              Cette tournée a été générée par notre IA en analysant vos rendez-vous existants, 
                              les distances entre clients et votre historique de déplacements.
                            </p>
                            <div className="grid grid-cols-1 gap-1.5">
                              <div className="flex items-center gap-2 text-xs text-[#1B263B]/70">
                                <div className="w-1.5 h-1.5 bg-[#F86F4D] rounded-full"></div>
                                <span>Réduction des temps de trajet</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-[#1B263B]/70">
                                <div className="w-1.5 h-1.5 bg-[#F86F4D] rounded-full"></div>
                                <span>Optimisation de l'itinéraire</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-[#1B263B]/70">
                                <div className="w-1.5 h-1.5 bg-[#F86F4D] rounded-full"></div>
                                <span>Gain de productivité</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Fermer
                </button>
                {selectedTournee.statut === 'suggestion' && (
                  <>
                    <button
                      onClick={() => {
                        handleAccepterSuggestion(selectedTournee.id);
                        closeModal();
                      }}
                      className="px-4 py-2 bg-[#F86F4D] text-white rounded-lg hover:bg-[#F86F4D]/90 transition-colors"
                    >
                      Accepter la suggestion
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>



