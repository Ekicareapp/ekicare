export default function TestResponsivePage() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8">
          Test de Responsivité Ekicare
        </h1>
        
        {/* Test des breakpoints */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Breakpoints de test :</h2>
            <div className="space-y-2 text-sm">
              <div className="block xs:hidden sm:hidden md:hidden lg:hidden xl:hidden 2xl:hidden bg-red-100 p-2 rounded">
                Mobile très petit (&lt; 475px)
              </div>
              <div className="hidden xs:block sm:hidden md:hidden lg:hidden xl:hidden 2xl:hidden bg-orange-100 p-2 rounded">
                Mobile petit (475px - 639px)
              </div>
              <div className="hidden xs:hidden sm:block md:hidden lg:hidden xl:hidden 2xl:hidden bg-yellow-100 p-2 rounded">
                Mobile/Tablette (640px - 767px)
              </div>
              <div className="hidden xs:hidden sm:hidden md:block lg:hidden xl:hidden 2xl:hidden bg-green-100 p-2 rounded">
                Tablette (768px - 1023px)
              </div>
              <div className="hidden xs:hidden sm:hidden md:hidden lg:block xl:hidden 2xl:hidden bg-blue-100 p-2 rounded">
                Desktop (1024px - 1279px)
              </div>
              <div className="hidden xs:hidden sm:hidden md:hidden lg:hidden xl:block 2xl:hidden bg-purple-100 p-2 rounded">
                Desktop large (1280px - 1535px)
              </div>
              <div className="hidden xs:hidden sm:hidden md:hidden lg:hidden xl:hidden 2xl:block bg-pink-100 p-2 rounded">
                Desktop très large (&gt; 1536px)
              </div>
            </div>
          </div>
        </div>

        {/* Test des grilles */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-sm font-medium">Item {i + 1}</div>
            </div>
          ))}
        </div>

        {/* Test des espacements */}
        <div className="space-y-4 mb-8">
          <div className="bg-white p-2 sm:p-4 lg:p-6 rounded-lg shadow">
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-2">
              Test des espacements responsifs
            </h3>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600">
              Ce contenu s&apos;adapte à la taille de l&apos;écran avec des espacements différents.
            </p>
          </div>
        </div>

        {/* Test des boutons */}
        <div className="flex flex-col xs:flex-row gap-2 sm:gap-4 mb-8">
          <button className="w-full xs:w-auto px-3 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-3 bg-blue-500 text-white rounded text-sm sm:text-base lg:text-lg">
            Bouton Responsif
          </button>
          <button className="w-full xs:w-auto px-3 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-3 bg-gray-500 text-white rounded text-sm sm:text-base lg:text-lg">
            Bouton Responsif 2
          </button>
        </div>

        {/* Test des images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <span className="text-white font-semibold">Image {i + 1}</span>
              </div>
              <div className="p-3 sm:p-4">
                <h4 className="text-sm sm:text-base font-semibold mb-1">Titre de l&apos;image</h4>
                <p className="text-xs sm:text-sm text-gray-600">Description de l&apos;image</p>
              </div>
            </div>
          ))}
        </div>

        {/* Test des formulaires */}
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4">
            Test de formulaire responsif
          </h3>
          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border rounded text-sm sm:text-base"
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input 
                  type="email" 
                  className="w-full px-3 py-2 border rounded text-sm sm:text-base"
                  placeholder="votre@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea 
                className="w-full px-3 py-2 border rounded text-sm sm:text-base h-20 sm:h-24"
                placeholder="Votre message"
              />
            </div>
            <button 
              type="submit"
              className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 bg-green-500 text-white rounded text-sm sm:text-base"
            >
              Envoyer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
