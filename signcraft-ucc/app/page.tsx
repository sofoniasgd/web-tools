"use client"

import { useState, useEffect } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Material {
  id: string
  name: string
  unitCost: number
  percentage: number
}

interface SavedProduct {
  id: string
  name: string
  cost: number
  materials: Material[]
}

export default function CostCalculator() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [materialName, setMaterialName] = useState("")
  const [unitCost, setUnitCost] = useState("")
  const [percentage, setPercentage] = useState("")
  const [productName, setProductName] = useState("")
  const [savedProducts, setSavedProducts] = useState<SavedProduct[]>([])
  const [showProductsList, setShowProductsList] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("savedProducts")
    if (saved) {
      setSavedProducts(JSON.parse(saved))
    }
  }, [])

  const addMaterial = () => {
    if (materialName && unitCost && percentage) {
      const newMaterial = {
        id: Math.random().toString(36).substr(2, 9),
        name: materialName,
        unitCost: Number.parseFloat(unitCost),
        percentage: Number.parseFloat(percentage),
      }
      setMaterials([...materials, newMaterial])
      setMaterialName("")
      setUnitCost("")
      setPercentage("")
    }
  }

  const deleteMaterial = (id: string) => {
    setMaterials(materials.filter((m) => m.id !== id))
  }

  const calculateTotalCost = () => {
    return materials.reduce((total, material) => {
      return total + material.unitCost * (material.percentage / 100)
    }, 0)
  }

  const saveProduct = () => {
    if (productName && materials.length > 0) {
      const newProduct = {
        id: Math.random().toString(36).substr(2, 9),
        name: productName,
        cost: calculateTotalCost(),
        materials: materials,
      }
      const updatedProducts = [...savedProducts, newProduct]
      setSavedProducts(updatedProducts)
      localStorage.setItem("savedProducts", JSON.stringify(updatedProducts))
      setProductName("")
      setMaterials([])
    }
  }

  const deleteProduct = (id: string) => {
    const updatedProducts = savedProducts.filter((p) => p.id !== id)
    setSavedProducts(updatedProducts)
    localStorage.setItem("savedProducts", JSON.stringify(updatedProducts))
  }

  return (
    <div className="min-h-screen bg-[#faf4f0] p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {!showProductsList ? (
          <div className="md:grid md:grid-cols-2 md:gap-6">
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-center mb-8">Unit cost Calculator</h1>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="material">Material</Label>
                  <Input
                    id="material"
                    value={materialName}
                    onChange={(e) => setMaterialName(e.target.value)}
                    placeholder="Enter material name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unitCost">Unit cost</Label>
                  <Input
                    id="unitCost"
                    type="number"
                    value={unitCost}
                    onChange={(e) => setUnitCost(e.target.value)}
                    placeholder="Enter unit cost"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="percentage">Percentage used</Label>
                  <Input
                    id="percentage"
                    type="number"
                    value={percentage}
                    onChange={(e) => setPercentage(e.target.value)}
                    placeholder="Enter percentage"
                  />
                </div>

                <Button onClick={addMaterial} className="w-full bg-[#b39b8c] hover:bg-[#a08977]">
                  Add
                </Button>
              </div>

              <div className="bg-[#f5ece7] p-4 rounded-lg space-y-2">
                {materials.map((material) => (
                  <div key={material.id} className="flex items-center justify-between">
                    <span>{`${material.name}: ${material.unitCost} : ${material.percentage}%`}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMaterial(material.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-xl font-semibold">Product Manufacturing Cost:</h2>
                  <p className="text-2xl font-bold">{calculateTotalCost().toFixed(2)} ETB</p>
                </div>

                <div className="flex gap-2">
                  <Input
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Product name"
                    className="bg-[#f5ece7]"
                  />
                  <Button onClick={saveProduct} className="bg-[#b39b8c] hover:bg-[#a08977]">
                    Save
                  </Button>
                </div>
              </div>

              <div className="text-center md:hidden">
                <Button variant="outline" onClick={() => setShowProductsList(true)} className="w-full">
                  Saved products
                </Button>
              </div>
            </div>

            <div className="hidden md:block">
              <h2 className="text-2xl font-bold text-center mb-8">Products List</h2>
              <div className="bg-[#f5ece7] p-4 rounded-lg space-y-2">
                {savedProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <span>{`${product.name}: ${product.cost.toFixed(2)} ETB`}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteProduct(product.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="md:hidden">
            <h2 className="text-2xl font-bold text-center mb-8">Products List</h2>
            <div className="bg-[#f5ece7] p-4 rounded-lg space-y-2 mb-6">
              {savedProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <span>{`${product.name}: ${product.cost.toFixed(2)} ETB`}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteProduct(product.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" onClick={() => setShowProductsList(false)} className="w-full">
              Back to calculator
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

