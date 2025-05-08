



"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Vehicle } from "../types/vehicle"
import { vehicleService } from "../services/api"
import { useNavigate } from "react-router-dom"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Trash2, Plus, Search, Car, Loader2, ChevronLeft, ChevronRight} from "lucide-react"
import { Badge } from "@/components/ui/badge"

const ITEMS_PER_PAGE = 15

const VehicleList: React.FC = () => {
  const navigate = useNavigate()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchVehicles()
  }, [])

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await vehicleService.getVehicles(250000)
      setVehicles(data)
    } catch (err) {
      setError("Failed to load vehicles. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await vehicleService.deleteVehicle(id)
        setVehicles(vehicles.filter((v) => v.vehicle_id !== id))
      } catch (err) {
        setError("Failed to delete vehicle. Please try again.")
      }
    }
  }

  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.vehicle_no.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedVehicles = filteredVehicles.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }


  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh] gap-3 w-full bg-gradient-to-b from-background to-muted/30">
        <div className="relative">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full bg-primary/20"></div>
        </div>
        <p className="text-muted-foreground font-medium">Loading vehicles...</p>
      </div>
    )
  }

  return (
    // <div className="w-full bg-black max-w-screen-xl mx-auto min-h-screen p-6 space-y-6 bg-gradient-to-b from-background to-muted/10 overflow-x-hidden">
    <div className="fixed inset-0 overflow-y-auto bg-black p-6 space-y-6 bg-gradient-to-b from-background to-muted/10 overflow-x-hidden">


      <div className="flex flex-col space-y-2 ">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Vehicle List
            </h1>
            <p className="text-muted-foreground">Manage and view all registered vehicles in the system</p>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="animate-in fade-in-50 slide-in-from-top-5 ">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center ">
        <div className="relative w-full sm:max-w-md">
          <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground">
            <Search className="h-4 w-4" />
          </div>
          <Input
            placeholder="Search by vehicle number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full border-primary/20 focus-visible:ring-primary/30"
          />
        </div>

        <Button
          onClick={() => navigate("/add")}
          className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Vehicle
        </Button>
      </div>

      <Card className="shadow-lg border-primary/10 overflow-hidden ">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary/5 hover:bg-primary/5 border-b border-primary/10">
                  <TableHead className="font-semibold text-primary/80">ID</TableHead>
                  <TableHead className="font-semibold text-primary/80">Vehicle Number</TableHead>
                  <TableHead className="font-semibold text-primary/80">Type ID</TableHead>
                  <TableHead className="text-right font-semibold text-primary/80">Created At</TableHead>
                  <TableHead className="text-right font-semibold text-primary/80">Created By</TableHead>
                  <TableHead className="text-right font-semibold text-primary/80">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedVehicles.map((vehicle, index) => (
                  <TableRow
                    key={vehicle.vehicle_id}
                    className={`hover:bg-primary/5 transition-colors ${index % 2 === 0 ? "bg-muted/30" : ""}`}
                  >
                    <TableCell className="font-medium ">{vehicle.vehicle_id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-primary/10 text-primary border-primary/20 font-medium px-3 py-1"
                        >
                          {vehicle.vehicle_no}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="pl-7">{vehicle.typeid}</TableCell>
                    <TableCell className="text-right">
                      {new Date(vehicle.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      {vehicle.created_by || "Unknown"}
                      </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(vehicle.vehicle_id)}
                        className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        {filteredVehicles.length > 0 && (
          <CardFooter className="flex items-center justify-center p-4 border-t border-primary/10 bg-muted/20">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="h-9 px-3 border-primary/20 hover:bg-primary/5 hover:text-primary disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Prev
              </Button>

              <div className="flex items-center">
                <span className="text-sm text-muted-foreground mx-2">
                  Page <span className="font-medium text-foreground">{currentPage}</span> of{" "}
                  <span className="font-medium text-foreground">{totalPages}</span>
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="h-9 px-3 border-primary/20 hover:bg-primary/5 hover:text-primary disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>

      {filteredVehicles.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
          <div className="rounded-full bg-primary/10 p-4 mb-4">
            <Car className="h-12 w-12 text-primary" />
          </div>
          <h3 className="text-xl font-medium mb-2">No vehicles found</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm ? "Try a different search term or" : "Get started by"} adding a new vehicle
          </p>
          <Button
            variant="default"
            onClick={() => navigate("/add")}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Vehicle
          </Button>
        </div>
      )}
    </div>
  )
}

export default VehicleList

