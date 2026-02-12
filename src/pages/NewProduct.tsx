import React, { useState } from 'react';
import { ArrowLeft, Package, FileText, Book, Palette, Upload, Link as LinkIcon, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../lib/theme.ts';
import {toast} from 'sonner';
import { useNavigate } from 'react-router-dom';
import { checkoutService } from '../services/checkoutService.ts';

type ProductType = 'physical' | 'digital';

interface ProductTypeOption {
  id: ProductType;
  name: string;
  icon: React.ElementType;
  description: string;
}

const productTypes: ProductTypeOption[] = [
  {
    id: 'physical',
    name: 'Produto Físico',
    icon: Package,
    description: 'Produtos que precisam ser enviados'
  },
  {
    id: 'digital',
    name: 'Produto Digital',
    icon: FileText,
    description: 'Arquivos digitais para download'
  }
];

export default function NewProduct() {
  const { isDarkMode } = React.useContext(ThemeContext);
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<ProductType | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [weight, setWeight] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');


  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files);
      setImages([...images, ...newImages]);
      
      // Create preview URLs
      const newPreviewUrls = newImages.map(file => URL.createObjectURL(file));
      setPreviewUrls([...previewUrls, ...newPreviewUrls]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
    
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    
    setImages(newImages);
    setPreviewUrls(newPreviewUrls);
  };

  return (
    <>
      <header className={`sticky top-0 z-20 ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-50'} px-4 lg:px-8 py-4`}>
        <div className="flex items-center gap-4">
          <Link to="/produtos" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Novo Produto</h1>
            <p className="text-sm text-gray-400">Adicione um novo produto</p>
          </div>
        </div>
      </header>

      <div className="p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} rounded-xl p-6 space-y-6 border`}>
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium mb-4">Tipo de produto</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {productTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`
                        p-6 rounded-lg border-2 flex items-start gap-4
                        ${selectedType === type.id 
                          ? 'border-[var(--primary-color)] bg-[var(--primary-light)]' 
                          : isDarkMode 
                            ? 'border-[var(--card-background)] hover:border-[var(--primary-color)]/50'
                            : 'border-gray-200 hover:border-[var(--primary-color)]/50'
                        }
                        transition-colors
                      `}
                    >
                      <div className={`p-3 rounded-lg ${selectedType === type.id ? 'bg-[var(--primary-color)] text-white' : 'bg-[var(--primary-color)]/10 text-[var(--primary-color)]'}`}>
                        <type.icon size={24} />
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium mb-1">{type.name}</h3>
                        <p className="text-sm text-gray-400">{type.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedType && (
                <>
                  <div className={`h-px ${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-gray-200'}`} />
                  <div>
                    <h2 className="text-lg font-medium mb-4">Informações do produto</h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="block">
                          <span className="text-sm font-medium text-gray-400">Nome do produto</span>
                          <input
                            type="text"
                            className={`mt-1 block w-full rounded-lg ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus:border-[var(--primary-color)] focus:ring-0 text-sm`}
                            placeholder="Digite o nome do produto"
                            value={name} onChange={(e) => setName(e.target.value)}
                          />
                        </label>

                        <label className="block">
                          <span className="text-sm font-medium text-gray-400">Preço</span>
                          <input
                            type="text"
                            className={`mt-1 block w-full rounded-lg ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus:border-[var(--primary-color)] focus:ring-0 text-sm`}
                            placeholder="R$ 0,00"
                            value={price} onChange={(e) => setPrice(e.target.value)}
                          />
                        </label>
                      </div>

                      {selectedType === 'physical' && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="block">
                              <span className="text-sm font-medium text-gray-400">Estoque</span>
                              <input
                                type="number"
                                className={`mt-1 block w-full rounded-lg ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus:border-[var(--primary-color)] focus:ring-0 text-sm`}
                                placeholder="Quantidade em estoque"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                              />
                            </label>

                            <label className="block">
                              <span className="text-sm font-medium text-gray-400">Peso (kg)</span>
                              <input
                                type="number"
                                step="0.1"
                                className={`mt-1 block w-full rounded-lg ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus:border-[var(--primary-color)] focus:ring-0 text-sm`}
                                placeholder="0.0"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                              />
                            </label>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <label className="block">
                              <span className="text-sm font-medium text-gray-400">Altura (cm)</span>
                              <input
                                type="number"
                                className={`mt-1 block w-full rounded-lg ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus:border-[var(--primary-color)] focus:ring-0 text-sm`}
                                placeholder="0"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                              />
                            </label>

                            <label className="block">
                              <span className="text-sm font-medium text-gray-400">Largura (cm)</span>
                              <input
                                type="number"
                                className={`mt-1 block w-full rounded-lg ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus:border-[var(--primary-color)] focus:ring-0 text-sm`}
                                placeholder="0"
                                value={width}
                                onChange={(e) => setWidth(e.target.value)}
                              />
                            </label>

                            <label className="block">
                              <span className="text-sm font-medium text-gray-400">Profundidade (cm)</span>
                              <input
                                type="number"
                                className={`mt-1 block w-full rounded-lg ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus:border-[var(--primary-color)] focus:ring-0 text-sm`}
                                placeholder="0"
                                value={length}
                                onChange={(e) => setLength(e.target.value)}
                              />
                            </label>
                          </div>

                          <div>
                            <span className="text-sm font-medium text-gray-400 block mb-2">Fotos do produto</span>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {previewUrls.map((url, index) => (
                                <div key={index} className="relative">
                                  <img
                                    src={url}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg"
                                  />
                                  <button
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ))}
                              <label className={`
                                flex flex-col items-center justify-center w-full h-32 rounded-lg cursor-pointer
                                border-2 border-dashed transition-colors
                                ${isDarkMode 
                                  ? 'border-white/5 hover:border-[var(--primary-color)]/50 bg-[var(--card-background)]' 
                                  : 'border-gray-200 hover:border-[var(--primary-color)]/50 bg-gray-50'}
                              `}>
                                <Upload className="text-gray-400 mb-2" size={24} />
                                <span className="text-sm text-gray-400">Upload de fotos</span>
                                <input
                                  type="file"
                                  className="hidden"
                                  multiple
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                />
                              </label>
                            </div>
                          </div>
                        </>
                      )}

                      {selectedType === 'digital' && (
                        <>
                          <div>
                            {previewUrls.map((url, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={url}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                                <button
                                  onClick={() => removeImage(index)}
                                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                            {previewUrls.length === 0 &&
                              <label className={`
                                flex flex-col items-center justify-center w-full h-32 rounded-lg cursor-pointer
                                border-2 border-dashed transition-colors
                                ${isDarkMode 
                                  ? 'border-white/5 hover:border-[var(--primary-color)]/50 bg-[var(--card-background)]' 
                                  : 'border-gray-200 hover:border-[var(--primary-color)]/50 bg-gray-50'}
                              `}>
                                <Upload className="text-gray-400 mb-2" size={24} />
                                <span className="text-sm text-gray-400">Upload de fotos</span>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                />
                              </label>
                            }
                          </div>

                          <label className="block">
                            <span className="text-sm font-medium text-gray-400">Link de acesso (opcional)</span>
                            <div className={`mt-1 flex items-center gap-2 rounded-lg ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus-within:border-[var(--primary-color)] px-3`}>
                              <LinkIcon size={16} className="text-gray-400" />
                              <input
                                type="url"
                                className="block w-full py-2 bg-transparent border-none focus:ring-0 text-sm"
                                placeholder="https://"
                              />
                            </div>
                          </label>
                        </>
                      )}

                    </div>
                  </div>
                </>
              )}
            </div>

            <div className={`pt-6 border-t ${isDarkMode ? 'border-[var(--card-background)]' : 'border-gray-200'}`}>
              <button
                disabled={!selectedType}
                onClick={async () => {
                  const formData = new FormData();
                  formData.append('name', name);
                  formData.append('price', price.replace('R$', '').replace(',', '.'));
                  formData.append('type', selectedType!);
                  
                  if (selectedType === 'physical') {
                    formData.append('stock', stock);
                    formData.append('weight', weight);
                    formData.append('length', length);
                    formData.append('width', width);
                    formData.append('height', height);
                  }

                  if (images[0]) {
                    formData.append('image', images[0]);
                  }

                  try {
                    await checkoutService.createProduct(formData);
                    navigate('/produtos');
                  } catch (err) {
                    console.error('Erro ao criar produto:', err);
                    
                    //alterar if depois de padronizar
                    const error = err as { response?: { data?: { message?: string, erro?: string, error?: string } } };
                    const errorMessage = error?.response?.data?.message || 
                                        error?.response?.data?.erro || 
                                        error?.response?.data?.error ||
                                        'Erro ao criar produto. Verifique os dados e tente novamente.';
                    
                    toast.error(errorMessage);
                  }
                }}
                className={`py-2 px-4 rounded-lg ${isDarkMode 
                      ? 'bg-[var(--primary-color)] text-white'
                      : 'bg-gray-100 text-gray-400'}`}
              >
                Criar produto
              </button>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}