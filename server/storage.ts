import { users, incidents, neighborhoods, type User, type InsertUser, type Incident, type InsertIncident, type Neighborhood, type InsertNeighborhood } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Incident operations
  getAllIncidents(): Promise<Incident[]>;
  getIncidentById(id: number): Promise<Incident | undefined>;
  createIncident(incident: InsertIncident): Promise<Incident>;
  getIncidentsByNeighborhood(neighborhood: string): Promise<Incident[]>;
  getRecentIncidents(): Promise<Incident[]>;
  getTodaysIncidents(): Promise<Incident[]>;
  
  // Neighborhood operations
  getAllNeighborhoods(): Promise<Neighborhood[]>;
  getNeighborhoodByName(name: string): Promise<Neighborhood | undefined>;
  updateNeighborhoodCount(name: string, count: number): Promise<void>;
  
  // Stats operations
  getTodaysStats(): Promise<{
    reportsToday: number;
    tenderLoin: number;
    nearUser: number;
    lastHour: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private incidents: Map<number, Incident>;
  private neighborhoods: Map<string, Neighborhood>;
  private currentUserId: number;
  private currentIncidentId: number;
  private currentNeighborhoodId: number;

  constructor() {
    this.users = new Map();
    this.incidents = new Map();
    this.neighborhoods = new Map();
    this.currentUserId = 1;
    this.currentIncidentId = 1;
    this.currentNeighborhoodId = 1;
    
    // Initialize with SF neighborhoods
    this.initializeNeighborhoods();
    this.initializeIncidents();
  }

  private initializeNeighborhoods() {
    const sfNeighborhoods = [
      { name: "Tenderloin", count: 12 },
      { name: "SOMA", count: 9 },
      { name: "Mission", count: 7 },
      { name: "Castro", count: 5 },
      { name: "Financial District", count: 3 },
      { name: "Union Square", count: 4 },
      { name: "Nob Hill", count: 2 },
    ];

    sfNeighborhoods.forEach(neighborhood => {
      const id = this.currentNeighborhoodId++;
      this.neighborhoods.set(neighborhood.name, {
        id,
        name: neighborhood.name,
        count: neighborhood.count,
      });
    });
  }

  private initializeIncidents() {
    const sampleIncidents = [
      {
        type: "human",
        latitude: "37.7849",
        longitude: "-122.4094",
        location: "Geary St & Leavenworth St",
        neighborhood: "Tenderloin",
        reporter: "Anonymous",
        status: "pending",
        createdAt: new Date(Date.now() - 120000), // 2 minutes ago
        isRecent: true,
      },
      {
        type: "human",
        latitude: "37.7849",
        longitude: "-122.4094",
        location: "Eddy St & Hyde St",
        neighborhood: "Tenderloin",
        reporter: "Anonymous",
        status: "pending",
        createdAt: new Date(Date.now() - 300000), // 5 minutes ago
        isRecent: true,
      },
      {
        type: "human",
        latitude: "37.7749",
        longitude: "-122.4194",
        location: "Market St & 3rd St",
        neighborhood: "SOMA",
        reporter: "Anonymous",
        status: "pending",
        createdAt: new Date(Date.now() - 600000), // 10 minutes ago
        isRecent: false,
      },
      {
        type: "dog",
        latitude: "37.7879",
        longitude: "-122.4075",
        location: "Powell St & Post St",
        neighborhood: "Union Square",
        reporter: "Anonymous",
        status: "pending",
        createdAt: new Date(Date.now() - 900000), // 15 minutes ago
        isRecent: false,
      },
      {
        type: "dog",
        latitude: "37.7749",
        longitude: "-122.4194",
        location: "Market St & 8th St",
        neighborhood: "SOMA",
        reporter: "Anonymous",
        status: "pending",
        createdAt: new Date(Date.now() - 1800000), // 30 minutes ago
        isRecent: false,
      },
      {
        type: "unknown",
        latitude: "37.7929",
        longitude: "-122.4057",
        location: "California St & Mason St",
        neighborhood: "Nob Hill",
        reporter: "Anonymous",
        status: "pending",
        createdAt: new Date(Date.now() - 3600000), // 1 hour ago
        isRecent: false,
      },
    ];

    sampleIncidents.forEach(incident => {
      const id = this.currentIncidentId++;
      this.incidents.set(id, { ...incident, id, imageUrl: null });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllIncidents(): Promise<Incident[]> {
    return Array.from(this.incidents.values());
  }

  async getIncidentById(id: number): Promise<Incident | undefined> {
    return this.incidents.get(id);
  }

  async createIncident(insertIncident: InsertIncident): Promise<Incident> {
    const id = this.currentIncidentId++;
    const incident: Incident = {
      id,
      type: insertIncident.type,
      latitude: insertIncident.latitude,
      longitude: insertIncident.longitude,
      location: insertIncident.location,
      neighborhood: insertIncident.neighborhood,
      reporter: insertIncident.reporter || "Anonymous",
      status: insertIncident.status || "pending",
      imageUrl: insertIncident.imageUrl || null,
      createdAt: new Date(),
      isRecent: true,
    };
    this.incidents.set(id, incident);
    
    // Update neighborhood count
    const neighborhood = this.neighborhoods.get(insertIncident.neighborhood);
    if (neighborhood) {
      neighborhood.count++;
    }
    
    return incident;
  }

  async getIncidentsByNeighborhood(neighborhood: string): Promise<Incident[]> {
    return Array.from(this.incidents.values()).filter(
      (incident) => incident.neighborhood === neighborhood,
    );
  }

  async getRecentIncidents(): Promise<Incident[]> {
    return Array.from(this.incidents.values()).filter(
      (incident) => incident.isRecent,
    );
  }

  async getTodaysIncidents(): Promise<Incident[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return Array.from(this.incidents.values()).filter(
      (incident) => incident.createdAt >= today,
    );
  }

  async getAllNeighborhoods(): Promise<Neighborhood[]> {
    return Array.from(this.neighborhoods.values());
  }

  async getNeighborhoodByName(name: string): Promise<Neighborhood | undefined> {
    return this.neighborhoods.get(name);
  }

  async updateNeighborhoodCount(name: string, count: number): Promise<void> {
    const neighborhood = this.neighborhoods.get(name);
    if (neighborhood) {
      neighborhood.count = count;
    }
  }

  async getTodaysStats(): Promise<{
    reportsToday: number;
    tenderLoin: number;
    nearUser: number;
    lastHour: number;
  }> {
    const todaysIncidents = await this.getTodaysIncidents();
    const lastHour = new Date(Date.now() - 3600000); // 1 hour ago
    
    return {
      reportsToday: todaysIncidents.length,
      tenderLoin: todaysIncidents.filter(i => i.neighborhood === "Tenderloin").length,
      nearUser: 8, // Mock value for nearby incidents
      lastHour: Array.from(this.incidents.values()).filter(
        (incident) => incident.createdAt >= lastHour,
      ).length,
    };
  }
}

export const storage = new MemStorage();
