export interface Vehicle {
    vehicle_id: number;
    vehicle_no: string;
    typeid: number;
    created_at: string;
    created_by: number;
    uuid: string;
  }
  
  export interface VehicleFormData {
    vehicleno: string;
    typeid: number;
    userid: number;
  }