"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Upload, FileText, Check, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ReceiptScannerProps {
  onScanComplete: (data: any) => void
}

export function ReceiptScanner({ onScanComplete }: ReceiptScannerProps) {
  const [activeTab, setActiveTab] = useState("upload")
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanResults, setScanResults] = useState<any | null>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)

      // Reset scan results
      setScanResults(null)
    }
  }

  const handleScan = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a receipt image first",
        variant: "destructive",
      })
      return
    }

    setIsScanning(true)

    // Simulate OCR processing
    setTimeout(() => {
      // Mock OCR results
      const mockResults = {
        merchant: "Grocery Store",
        date: new Date().toISOString().split("T")[0],
        total: (Math.random() * 100 + 10).toFixed(2),
        items: [
          { name: "Milk", price: (Math.random() * 5 + 2).toFixed(2) },
          { name: "Bread", price: (Math.random() * 4 + 1).toFixed(2) },
          { name: "Eggs", price: (Math.random() * 6 + 3).toFixed(2) },
        ],
      }

      setScanResults(mockResults)
      setIsScanning(false)

      toast({
        title: "Receipt Scanned",
        description: "Receipt has been successfully processed",
      })
    }, 2000)
  }

  const handleUseResults = () => {
    if (scanResults) {
      onScanComplete({
        description: `${scanResults.merchant}`,
        amount: scanResults.total,
        date: scanResults.date,
        category: "Groceries",
        notes: `Items: ${scanResults.items.map((item: any) => `${item.name} ($${item.price})`).join(", ")}`,
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Receipt Scanner</CardTitle>
        <CardDescription>
          Upload or take a photo of your receipt to automatically extract expense details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="camera">
              <Camera className="mr-2 h-4 w-4" />
              Camera
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="receipt">Upload Receipt</Label>
              <Input id="receipt" type="file" accept="image/*" onChange={handleFileChange} />
            </div>
          </TabsContent>

          <TabsContent value="camera" className="space-y-4">
            <div className="flex flex-col items-center justify-center gap-4 p-4 border-2 border-dashed rounded-lg">
              <Camera className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground text-center">
                Camera access is not available in this preview. Please use the upload option instead.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {preview && (
          <div className="mt-4 space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <img
                src={preview || "/placeholder.svg"}
                alt="Receipt preview"
                className="w-full object-contain max-h-[300px]"
              />
            </div>

            <Button onClick={handleScan} disabled={isScanning} className="w-full">
              {isScanning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Scan Receipt
                </>
              )}
            </Button>
          </div>
        )}

        {scanResults && (
          <div className="mt-4 space-y-4 border rounded-lg p-4">
            <h3 className="font-medium">Scan Results</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Merchant:</span>
                <span className="text-sm">{scanResults.merchant}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Date:</span>
                <span className="text-sm">{scanResults.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Total:</span>
                <span className="text-sm">${scanResults.total}</span>
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium">Items:</span>
                <ul className="text-sm space-y-1">
                  {scanResults.items.map((item: any, index: number) => (
                    <li key={index} className="flex justify-between">
                      <span>{item.name}</span>
                      <span>${item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Button onClick={handleUseResults} className="w-full" variant="default">
              <Check className="mr-2 h-4 w-4" />
              Use These Results
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
