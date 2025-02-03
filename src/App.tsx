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
import { Document, Page } from 'react-pdf';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showConvertMenu, setShowConvertMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [numPages, setNumPages] = useState<number | null>(null);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);

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

  const handleApiCall = async (endpoint: string) => {
    if (!selectedFile) {
      alert('Por favor, selecciona un archivo PDF primero.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`http://localhost:8000/pdf_app/${endpoint}/`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handlePageClick = (pageNumber: number) => {
    setSelectedPages((prevSelectedPages) =>
      prevSelectedPages.includes(pageNumber)
        ? prevSelectedPages.filter((page) => page !== pageNumber)
        : [...prevSelectedPages, pageNumber]
    );
  };

  const handleEditPages = async () => {
    if (!selectedFile) {
      alert('Por favor, selecciona un archivo PDF primero.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    selectedPages.forEach((page, index) => {
      formData.append(`page_number_${index}`, page.toString());
    });

    try {
      const response = await fetch('http://localhost:8000/pdf_app/editar_pagina/', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const tools = [
    {
      id: 'merge',
      title: 'Merge PDFs',
      description: 'Combine multiple PDF files into one.',
      icon: Merge,
      action: () => handleApiCall('merge'),
    },
    {
      id: 'split',
      title: 'Split PDF',
      description: 'Split a PDF file into multiple files.',
      icon: Scissors,
      action: () => handleApiCall('split'),
    },
    {
      id: 'edit',
      title: 'Edit PDF',
      description: 'Edit the content of your PDF file.',
      icon: PenTool,
      action: () => handleApiCall('edit'),
    },
    {
      id: 'convert',
      title: 'Convert PDF',
      description: 'Convert your PDF file to other formats.',
      icon: FileOutput,
      options: [
        { name: 'To Word', endpoint: 'convert_to_word' },
        { name: 'To Excel', endpoint: 'convert_to_excel' },
        { name: 'To Image', endpoint: 'convert_to_image' },
      ],
    },
    {
      id: 'delete',
      title: 'Delete Pages',
      description: 'Delete specific pages from your PDF file.',
      icon: Trash2,
      action: () => handleApiCall('delete_pages'),
    },
    {
      id: 'add_image',
      title: 'Add Image',
      description: 'Add images to your PDF file.',
      icon: Image,
      action: () => handleApiCall('add_image'),
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
                  onClick={() => tool.id !== 'convert' && tool.action && tool.action()}
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
                          key={option.name}
                          href="#"
                          className={`block px-4 py-2 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-600 hover:text-blue-400' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
                          onClick={(e) => {
                            e.preventDefault();
                            handleApiCall(option.endpoint);
                          }}
                        >
                          {option.name}
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
              onClick={() => tool.id !== 'convert' && tool.action && tool.action()}
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
                onClick={handleEditPages}
              >
                <Download className="w-5 h-5 mr-2" />
                Editar Páginas
              </button>
            </div>
            <div className={`aspect-[1/1.4] ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg flex items-center justify-center`}>
              <Document
                file={selectedFile}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <div
                    key={`page_${index + 1}`}
                    className={`relative ${selectedPages.includes(index + 1) ? 'border-4 border-red-500' : ''}`}
                    onClick={() => handlePageClick(index + 1)}
                  >
                    <Page pageNumber={index + 1} />
                  </div>
                ))}
              </Document>
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