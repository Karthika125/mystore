
import { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { formatCurrency } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from '@/types';

export default function AdminProducts() {
  const { data: products, isLoading } = useProducts();
  const { data: categories } = useCategories();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);
  const [search, setSearch] = useState('');

  const handleCreateProduct = () => {
    setCurrentProduct({
      name: '',
      description: '',
      price: 0,
      images: [],
      category_id: '',
      inventory_count: 0,
    });
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setCurrentProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentProduct) return;
    
    if (currentProduct.id) {
      updateProductMutation.mutate(currentProduct as Product);
    } else {
      createProductMutation.mutate(currentProduct as Omit<Product, 'id' | 'created_at'>);
    }
    
    setIsDialogOpen(false);
    setCurrentProduct(null);
  };

  const confirmDelete = () => {
    if (currentProduct?.id) {
      deleteProductMutation.mutate(currentProduct.id);
    }
    setIsDeleteDialogOpen(false);
    setCurrentProduct(null);
  };

  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(search.toLowerCase()) || 
    product.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Product Management</h1>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="w-full sm:w-64">
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button onClick={handleCreateProduct}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !filteredProducts || filteredProducts.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              No products found.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inventory
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => {
                  const category = categories?.find(cat => cat.id === product.category_id);
                  return (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {product.images && product.images.length > 0 ? (
                              <img className="h-10 w-10 object-cover rounded" src={product.images[0]} alt="" />
                            ) : (
                              <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                                <span className="text-xs text-gray-500">No img</span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500 line-clamp-1">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatCurrency(product.price)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${product.inventory_count <= 0 ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                          {product.inventory_count}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{category?.name || 'Uncategorized'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditProduct(product)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(product)} className="text-red-600 hover:text-red-800">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      {/* Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{currentProduct?.id ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {currentProduct?.id 
                ? 'Update your product information below'
                : 'Fill out the form to add a new product'
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Product Name *
              </label>
              <Input
                id="name"
                value={currentProduct?.name || ''}
                onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <Input
                id="description"
                value={currentProduct?.description || ''}
                onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price *
                </label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentProduct?.price || 0}
                  onChange={(e) => setCurrentProduct({...currentProduct, price: parseFloat(e.target.value)})}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="inventory" className="block text-sm font-medium text-gray-700">
                  Inventory Count *
                </label>
                <Input
                  id="inventory"
                  type="number"
                  min="0"
                  value={currentProduct?.inventory_count || 0}
                  onChange={(e) => setCurrentProduct({...currentProduct, inventory_count: parseInt(e.target.value)})}
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <Select
                value={currentProduct?.category_id || ""}
                onValueChange={(value) => setCurrentProduct({...currentProduct, category_id: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="images" className="block text-sm font-medium text-gray-700">
                Image URLs (one per line)
              </label>
              <textarea
                id="images"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                value={currentProduct?.images?.join('\n') || ''}
                onChange={(e) => setCurrentProduct({...currentProduct, images: e.target.value.split('\n').filter(url => url.trim() !== '')})}
                rows={3}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {createProductMutation.isPending || updateProductMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {currentProduct?.id ? 'Update Product' : 'Add Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{currentProduct?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              {deleteProductMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
