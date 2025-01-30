import React, { useState, useEffect } from 'react';
import {
  FileUp,
  Merge,
  Scissors,
  PenTool,
  FileOutput,
  Download,
  Trash2,
  Image,
  ChevronDown,
  Moon,
  Sun,
} from 'lucide-react';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showConvertMenu, setShowConvertMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    }
  };

  const handleUploadClick = () => {
    document.getElementById('file-upload')?.click();
  };

  const tools = [
    {
      id: 'merge',
      title: 'Unir PDFs',
      description: 'Combina múltiples archivos PDF en uno solo',
      icon: Merge,
    },
    {
      id: 'edit',
      title: 'Editar Páginas',
      description: 'Elimina, reordena o extrae páginas',
      icon: Scissors,
    },
    {
      id: 'sign',
      title: 'Firmar PDF',
      description: 'Añade tu firma digital al documento',
      icon: PenTool,
    },
    {
      id: 'convert',
      title: 'Convertir Formato',
      description: 'Convierte a Word, Excel o imágenes',
      icon: FileOutput,
      options: [
        'PDF a Word',
        'PDF a Excel',
        'PDF a PowerPoint',
        'PDF a Imagen',
        'PDF a Texto',
      ],
    },
    {
      id: 'delete',
      title: 'Eliminar Páginas',
      description: 'Elimina páginas específicas del PDF',
      icon: Trash2,
    },
    {
      id: 'image-to-pdf',
      title: 'Imagen a PDF',
      description: 'Convierte imágenes a formato PDF',
      icon: Image,
    },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm relative`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>PDF Editor Online</h1>
              <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Edita tus PDFs de forma rápida y sencilla - Sin registro necesario
              </p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'} hover:bg-opacity-80 transition-colors`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Top Menu Bar */}
      <nav className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm mt-1`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tools.map((tool) => (
              <div 
                key={tool.id} 
                className="relative"
                onMouseEnter={() => tool.id === 'convert' && setShowConvertMenu(true)}
                onMouseLeave={() => tool.id === 'convert' && setShowConvertMenu(false)}
              >
                <button
                  className={`px-3 py-4 text-sm font-medium ${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'} flex items-center space-x-1 group`}
                  onClick={() => tool.id !== 'convert' && handleUploadClick()}
                >
                  <tool.icon className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-500'} group-hover:text-blue-600`} />
                  <span className="ml-2">{tool.title}</span>
                  {tool.id === 'convert' && (
                    <ChevronDown className="w-4 h-4 ml-1" />
                  )}
                </button>
                {tool.id === 'convert' && showConvertMenu && (
                  <div className={`absolute z-10 left-0 mt-0 w-56 rounded-md shadow-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} ring-1 ring-black ring-opacity-5`}>
                    <div className="py-1">
                      {tool.options?.map((option) => (
                        <a
                          key={option}
                          href="#"
                          className={`block px-4 py-2 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-600 hover:text-blue-400' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
                          onClick={(e) => {
                            e.preventDefault();
                            handleUploadClick();
                          }}
                        >
                          {option}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* File Upload Section */}
        <div className="mb-8">
          <div className="max-w-xl mx-auto">
            <label
              htmlFor="file-upload"
              className={`flex flex-col items-center px-6 py-12 border-2 border-dashed ${
                darkMode 
                  ? 'border-gray-600 hover:border-blue-400' 
                  : 'border-gray-300 hover:border-blue-500'
              } rounded-lg cursor-pointer transition-colors`}
            >
              <FileUp className={`w-12 h-12 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
              <span className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Arrastra y suelta tu PDF aquí o haz clic para seleccionar
              </span>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <div 
              key={tool.id} 
              className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center">
                <tool.icon className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                <h3 className={`ml-3 text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {tool.title}
                </h3>
              </div>
              <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {tool.description}
              </p>
            </div>
          ))}
        </div>

        {/* Preview Section with Download Button */}
        {selectedFile && (
          <div className={`mt-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-sm`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Vista Previa
              </h2>
              <button
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                onClick={() => {/* Handle download */}}
              >
                <Download className="w-5 h-5 mr-2" />
                Descargar PDF
              </button>
            </div>
            <div className={`aspect-[1/1.4] ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg flex items-center justify-center`}>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Vista previa del PDF</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`${darkMode ? 'bg-gray-800' : 'bg-white'} mt-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Todas las operaciones se realizan en tu navegador. Tus archivos nunca se suben a ningún servidor.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
