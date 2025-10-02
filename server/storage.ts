import { type User, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";
import { readFile, writeFile, existsSync } from "fs";
import { resolve } from "path";
import bcrypt from "bcryptjs";
import { promisify } from "util";

// Re-using the Person interface from Home.tsx mock for consistency in storage implementation
// Note: In a real app, this should come from shared/schema.ts
export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  age?: number;
  residence?: string;
  occupation?: string;
  bio?: string;
  whatsapp?: string;
  fatherId?: string;
  motherId?: string;
  spouseId?: string;
  role: "admin" | "user" | "none";
  username?: string;
  passwordHash?: string; // Storing hash for in-memory persistence mock
  sideRelations: { id: string; relationType: string }[]; // Using simplified type for mock
}

// Define the shape of data in the file store
interface DataStore {
  users: User[];
  persons: Person[];
}

// Data file path
const DATA_FILE = resolve(import.meta.dirname, "data.json");
const SALT_ROUNDS = 10;

// Promisify file system functions
const read = promisify(readFile);
const write = promisify(writeFile);

export interface IStorage {
  // User Management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPassword(username: string, newPasswordHash: string): Promise<boolean>;

  // Person Management
  getPerson(id: string): Promise<Person | undefined>;
  getPersons(): Promise<Person[]>;
  createPerson(person: Omit<Person, "id">, password?: string): Promise<Person>;
  updatePerson(id: string, updates: Partial<Person & { newPassword?: string, newUsername?: string }>): Promise<Person | undefined>;
  deletePerson(id: string): Promise<boolean>;
  
  // Data Utility
  saveData(): Promise<void>;
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hash: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private data: DataStore;
  private isLoaded: boolean = false;

  constructor() {
    this.data = { users: [], persons: [] };
  }

  public async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  public async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  private async ensureLoaded() {
    if (!this.isLoaded) {
      await this.loadData();
      this.isLoaded = true;
    }
  }

  private async loadData(): Promise<void> {
    if (existsSync(DATA_FILE)) {
      try {
        const fileContent = await read(DATA_FILE, "utf-8");
        this.data = JSON.parse(fileContent) as DataStore;
        log(`Loaded data from ${DATA_FILE}`, "storage");
      } catch (error) {
        log(`Error loading data, initializing with seed: ${error}`, "storage");
        await this.initSeedData();
      }
    } else {
      log("Data file not found, initializing with seed data", "storage");
      await this.initSeedData();
    }
  }
  
  public async saveData(): Promise<void> {
    await write(DATA_FILE, JSON.stringify(this.data, null, 2));
    log(`Saved data to ${DATA_FILE}`, "storage");
  }

  private async initSeedData() {
    // Using the mock data from client/src/pages/Home.tsx as the seed
    const seedPersons = [
      {
        id: "1", firstName: "أحمد", lastName: "السالم", age: 85, residence: "الرياض، المملكة العربية السعودية", occupation: "متقاعد", bio: "جد العائلة، أسس الأعمال التجارية للعائلة في الستينيات", whatsapp: "+966501111111", role: "admin", username: "admin", passwordHash: await this.hashPassword("asd123"), spouseId: "2", fatherId: undefined, motherId: undefined, sideRelations: [],
      },
      {
        id: "2", firstName: "فاطمة", lastName: "العلي", age: 80, residence: "الرياض، المملكة العربية السعودية", occupation: "ربة منزل", bio: "جدة العائلة، معلمة متقاعدة", whatsapp: "+966501111112", role: "none", spouseId: "1", fatherId: undefined, motherId: undefined, sideRelations: [],
      },
      {
        id: "3", firstName: "محمد", lastName: "السالم", age: 55, residence: "جدة، المملكة العربية السعودية", occupation: "مهندس معماري", bio: "مهندس معماري متخصص في التصميم الحديث مع لمسات تراثية", whatsapp: "+966502222222", fatherId: "1", motherId: "2", role: "admin", username: "mohamed.s", passwordHash: await this.hashPassword("123"), spouseId: "4", sideRelations: [],
      },
      {
        id: "4", firstName: "سارة", lastName: "الأحمد", age: 52, residence: "جدة، المملكة العربية السعودية", occupation: "معلمة لغة عربية", bio: "معلمة لغة عربية في مدرسة ثانوية", whatsapp: "+966502222223", spouseId: "3", role: "user", username: "sara.a", passwordHash: await this.hashPassword("123"), fatherId: undefined, motherId: undefined, sideRelations: [],
      },
      {
        id: "5", firstName: "خالد", lastName: "السالم", age: 28, residence: "الرياض، المملكة العربية السعودية", occupation: "طبيب", bio: "طبيب أطفال في مستشفى حكومي", whatsapp: "+966503333333", fatherId: "3", motherId: "4", role: "user", username: "khalid.s", passwordHash: await this.hashPassword("123"), spouseId: undefined, sideRelations: [],
      },
      {
        id: "6", firstName: "نورة", lastName: "السالم", age: 25, residence: "جدة، المملكة العربية السعودية", occupation: "مصممة جرافيك", bio: "مصممة جرافيك تعمل في شركة إعلانات", whatsapp: "+966503333334", fatherId: "3", motherId: "4", role: "user", username: "noura.s", passwordHash: await this.hashPassword("123"), spouseId: undefined, sideRelations: [],
      },
      {
        id: "7", firstName: "عبدالله", lastName: "السالم", age: 50, residence: "الدمام، المملكة العربية السعودية", occupation: "رجل أعمال", bio: "رجل أعمال في قطاع الاستيراد والتصدير", whatsapp: "+966504444444", fatherId: "1", motherId: "2", role: "user", username: "abdullah.s", passwordHash: await this.hashPassword("123"), spouseId: "8", sideRelations: [],
      },
      {
        id: "8", firstName: "منى", lastName: "الحربي", age: 48, residence: "الدمام، المملكة العربية السعودية", occupation: "صيدلانية", bio: "صيدلانية تدير صيدلية خاصة", whatsapp: "+966504444445", spouseId: "7", role: "user", username: "mona.h", passwordHash: await this.hashPassword("123"), fatherId: undefined, motherId: undefined, sideRelations: [],
      },
      {
        id: "9", firstName: "يوسف", lastName: "السالم", age: 22, residence: "الدمام، المملكة العربية السعودية", occupation: "طالب جامعي", bio: "طالب هندسة حاسب في السنة النهائية", whatsapp: "+966505555555", fatherId: "7", motherId: "8", role: "user", username: "yousef.s", passwordHash: await this.hashPassword("123"), spouseId: undefined, sideRelations: [],
      },
      {
        id: "10", firstName: "عمر", lastName: "السالم", age: 48, residence: "الرياض، المملكة العربية السعودية", occupation: "محامي", bio: "محامي متخصص في القضايا التجارية", whatsapp: "+966506666666", fatherId: "1", motherId: "2", role: "user", username: "omar.s", passwordHash: await this.hashPassword("123"), spouseId: "11", sideRelations: [],
      },
      {
        id: "11", firstName: "لينا", lastName: "القحطاني", age: 45, residence: "الرياض، المملكة العربية السعودية", occupation: "طبيبة أسنان", bio: "طبيبة أسنان تملك عيادة خاصة", whatsapp: "+966506666667", spouseId: "10", role: "user", username: "lina.a", passwordHash: await this.hashPassword("123"), fatherId: undefined, motherId: undefined, sideRelations: [],
      },
      {
        id: "12", firstName: "ريم", lastName: "السالم", age: 20, residence: "الرياض، المملكة العربية السعودية", occupation: "طالبة جامعية", bio: "طالبة طب في السنة الثالثة", whatsapp: "+966507777777", fatherId: "10", motherId: "11", role: "user", username: "reem.s", passwordHash: await this.hashPassword("123"), spouseId: undefined, sideRelations: [],
      },
    ];

    this.data.persons = seedPersons.map(p => ({
        ...p,
        sideRelations: p.sideRelations || [] // Ensure it's not undefined
    }));
    
    // Create separate user records for every person with a username/password
    this.data.users = this.data.persons
        .filter(p => p.username && p.passwordHash)
        .map(p => ({
            id: p.id,
            username: p.username!,
            password: p.passwordHash!, // Storing the hash in the user record
        }));

    await this.saveData();
    log("Initialized data from seed", "storage");
  }

  // --- User Management Implementations ---

  async getUser(id: string): Promise<User | undefined> {
    await this.ensureLoaded();
    // Since Drizzle schema is not fully implemented in the mock, we use the Person interface
    return this.data.users.find((user) => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    await this.ensureLoaded();
    return this.data.users.find((user) => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    await this.ensureLoaded();
    const id = randomUUID();
    const passwordHash = await this.hashPassword(insertUser.password);
    const user: User = { ...insertUser, id, password: passwordHash };
    this.data.users.push(user);
    await this.saveData();
    return user;
  }
  
  async updateUserPassword(username: string, newPasswordHash: string): Promise<boolean> {
    await this.ensureLoaded();
    const user = this.data.users.find(u => u.username === username);
    if (!user) return false;
    
    user.password = newPasswordHash;
    
    // Also update the person's passwordHash
    const person = this.data.persons.find(p => p.username === username);
    if (person) {
        person.passwordHash = newPasswordHash;
    }
    
    await this.saveData();
    return true;
  }

  // --- Person Management Implementations ---

  async getPerson(id: string): Promise<Person | undefined> {
    await this.ensureLoaded();
    return this.data.persons.find((p) => p.id === id);
  }

  async getPersons(): Promise<Person[]> {
    await this.ensureLoaded();
    return this.data.persons;
  }

  async createPerson(person: Omit<Person, "id" | "passwordHash" | "username" | "sideRelations"> & { username?: string, password?: string }, password?: string): Promise<Person> {
    await this.ensureLoaded();
    
    const newPerson: Person = {
      ...person,
      id: randomUUID(),
      role: person.role || "none",
      sideRelations: person.sideRelations || [],
      username: person.username,
      passwordHash: undefined
    };

    if (newPerson.role !== 'none' && newPerson.username && password) {
        const passwordHash = await this.hashPassword(password);
        newPerson.passwordHash = passwordHash;
        
        // Create a corresponding user entry
        const newUser: User = { 
            id: newPerson.id, 
            username: newPerson.username, 
            password: passwordHash 
        };
        this.data.users.push(newUser);
    }
    
    this.data.persons.push(newPerson);
    await this.saveData();
    return newPerson;
  }

  async updatePerson(id: string, updates: Partial<Person & { newPassword?: string, newUsername?: string }>): Promise<Person | undefined> {
    await this.ensureLoaded();
    const personIndex = this.data.persons.findIndex((p) => p.id === id);
    if (personIndex === -1) return undefined;

    const currentPerson = this.data.persons[personIndex];
    let updatedPerson: Person = {
        ...currentPerson,
        ...updates,
        // Ensure role is respected
        role: updates.role || currentPerson.role,
        // The PersonForm sends "newUsername" but we store it as "username"
        username: updates.newUsername || currentPerson.username,
    };
    
    // --- Handle Password Update ---
    if (updates.newPassword && updates.newPassword.length > 0) {
        const newPasswordHash = await this.hashPassword(updates.newPassword);
        updatedPerson.passwordHash = newPasswordHash;
        
        // Update user record if one exists
        const user = this.data.users.find(u => u.username === updatedPerson.username);
        if (user) {
            user.password = newPasswordHash;
        }
    }
    
    // --- Handle Username/Role Changes (User Account Creation/Deletion) ---
    const isNewAccount = updatedPerson.role !== 'none' && updatedPerson.username && !currentPerson.username;
    const isAccountRemoval = updatedPerson.role === 'none' && currentPerson.role !== 'none';
    
    if (isNewAccount) {
        if (!updatedPerson.passwordHash) {
            // This case should be handled by form validation/front-end, but kept for robustness.
            const defaultPassword = "password123"; 
            updatedPerson.passwordHash = await this.hashPassword(defaultPassword);
        }
        
        // Create user entry
        const newUser: User = { 
            id: updatedPerson.id, 
            username: updatedPerson.username!, 
            password: updatedPerson.passwordHash! 
        };
        this.data.users.push(newUser);
        log(`Created user account for ${updatedPerson.username}`, "storage");

    } else if (isAccountRemoval) {
        // Account disabled/removed
        this.data.users = this.data.users.filter(u => u.username !== currentPerson.username);
        updatedPerson.username = undefined;
        updatedPerson.passwordHash = undefined;
    } else if (currentPerson.username && updatedPerson.username !== currentPerson.username) {
        // Handle username change: update user entry
        const user = this.data.users.find(u => u.username === currentPerson.username);
        if (user) {
            user.username = updatedPerson.username!;
        }
    }
    
    // --- Final Update ---
    this.data.persons[personIndex] = updatedPerson;
    await this.saveData();
    return updatedPerson;
  }

  async deletePerson(id: string): Promise<boolean> {
    await this.ensureLoaded();
    const initialLength = this.data.persons.length;
    const personToDelete = this.data.persons.find(p => p.id === id);
    
    if (personToDelete && personToDelete.username) {
        // Remove associated user account
        this.data.users = this.data.users.filter(u => u.username !== personToDelete.username);
    }
    
    this.data.persons = this.data.persons.filter((p) => p.id !== id);
    
    // Also remove relations where this person is a parent/spouse/side-relation to avoid dangling IDs
    this.data.persons.forEach(p => {
        if (p.fatherId === id) p.fatherId = undefined;
        if (p.motherId === id) p.motherId = undefined;
        if (p.spouseId === id) p.spouseId = undefined;
        p.sideRelations = p.sideRelations.filter(rel => rel.id !== id);
    });

    const deleted = this.data.persons.length < initialLength;
    if (deleted) {
      await this.saveData();
    }
    return deleted;
  }
}

// Re-exporting log from vite.ts for use here
import { log } from "./vite";

export const storage = new MemStorage();
