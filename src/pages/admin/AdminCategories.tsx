
import { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/useCategories';
import { Category } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminCategories() {
  const { data: categories, isLoading } = useCategories();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Partial<Category> | null>(null);
  const [search, setSearch] = useState('');

  const handleCreateCategory = () => {
    setCurrentCategory({
      name: '',
      description: '',
    });
    setIsDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setCurrentCategory(category);
    setIsDialogOpen(true);
  };

  const handleDeleteCategory = (category: Category) => {
    setCurrentCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentCategory) return;
    
    if (currentCategory.id) {
      updateCategoryMutation.mutate(currentCategory as Category);
    } else {
      createCategoryMutation.mutate(currentCategory as Omit<Category, 'id'>);
    }
    
    setIsDialogOpen(false);
    setCurrentCategory(null);
  };

  const confirmDelete = () => {
    if (currentCategory?.id) {
      deleteCategoryMutation.mutate(currentCategory.id);
    }
    setIsDeleteDialogOpen(false);
    setCurrentCategory(null);
  };

  const filteredCategories = categories?.filter(category => 
    category.name.toLowerCase().includes(search.toLowerCase()) || 
    (category.description && category.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Category Management</h1>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="w-full sm:w-64">
            <Input
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button onClick={handleCreateCategory}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Category
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !filteredCategories || filteredCategories.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              No categories found.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{category.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 line-clamp-2">{category.description || 'No description'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditCategory(category)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(category)} className="text-red-600 hover:text-red-800">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      {/* Category Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{currentCategory?.id ? 'Edit Category' : 'Add New Category'}</DialogTitle>
            <DialogDescription>
              {currentCategory?.id 
                ? 'Update your category information below'
                : 'Fill out the form to add a new category'
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Category Name *
              </label>
              <Input
                id="name"
                value={currentCategory?.name || ''}
                onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <Input
                id="description"
                value={currentCategory?.description || ''}
                onChange={(e) => setCurrentCategory({...currentCategory, description: e.target.value})}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {createCategoryMutation.isPending || updateCategoryMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {currentCategory?.id ? 'Update Category' : 'Add Category'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{currentCategory?.name}"? Products in this category will not be deleted, but they will no longer be associated with this category.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              {deleteCategoryMutation.isPending ? (
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
