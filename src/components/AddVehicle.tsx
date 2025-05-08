


import React, { useState } from 'react';
import { vehicleService } from '../services/api';
import type { VehicleFormData } from '../types/vehicle';
import { useNavigate } from 'react-router-dom';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";

const vehicleTypes = [
  { id: 1, name: 'Sedan' },
  { id: 2, name: 'SUV' },
  { id: 3, name: 'Truck' },
  { id: 4, name: 'Van' },
];

const AddVehicle: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<VehicleFormData>({
    vehicleno: '',
    typeid: 1,
    userid: 1,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await vehicleService.createVehicle(formData);
      setSuccess('✅ Vehicle added successfully!');
      setFormData({ vehicleno: '', typeid: 1, userid: 1 });
      setError(null);
    } catch (err) {
      setError('❌ Failed to add vehicle. Please try again.');
      setSuccess(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      typeid: parseInt(value),
    }));
  };

  return (
    // <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
    <div className="fixed inset-0 overflow-y-auto bg-black p-6 space-y-6 bg-gradient-to-b from-background to-muted/10 overflow-x-hidden">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">Add New Vehicle</h1>
            <p className="text-sm text-muted-foreground">Fill the form below to register a vehicle.</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/')}>
            ← Back
          </Button>
        </div>

        <Card className="p-6 shadow-lg rounded-2xl border border-gray-200 bg-white">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4 border-green-300 bg-green-50 text-green-800">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="vehicleno" className="text-sm font-medium text-gray-700">Vehicle Number</Label>
              <Input
                id="vehicleno"
                name="vehicleno"
                placeholder="e.g., MH12AB1234"
                value={formData.vehicleno}
                onChange={handleInputChange}
                required
                className="focus-visible:ring-primary/40"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="typeid" className="text-sm font-medium text-gray-700">Vehicle Type</Label>
              <Select
                value={formData.typeid.toString()}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger id="typeid" className="focus:ring-primary/40">
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Vehicle'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AddVehicle;
