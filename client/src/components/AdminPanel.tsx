import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Download,
  Upload,
  Key,
  Shield,
} from "lucide-react";

interface Person {
  id: string;
  firstName: string;
  lastName: string;
  age?: number;
  residence?: string;
  occupation?: string;
  role?: "admin" | "user" | "none";
}

interface AdminPanelProps {
  persons: Person[];
  onAddPerson?: () => void;
  onEditPerson?: (person: Person) => void;
  onDeletePerson?: (personId: string) => void;
  onExportData?: () => void;
  onImportData?: () => void;
  onChangePassword?: (personId: string) => void;
}

export default function AdminPanel({
  persons,
  onAddPerson,
  onEditPerson,
  onDeletePerson,
  onExportData,
  onImportData,
  onChangePassword,
}: AdminPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPersons = persons.filter(
    (person) =>
      person.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            لوحة الأدمن
          </h1>
          <p className="text-muted-foreground mt-1">
            إدارة أفراد العائلة والصلاحيات
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onImportData}
            data-testid="button-import"
          >
            <Upload className="ml-2 h-4 w-4" />
            استيراد
          </Button>
          <Button
            variant="outline"
            onClick={onExportData}
            data-testid="button-export"
          >
            <Download className="ml-2 h-4 w-4" />
            تصدير
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>إدارة الأفراد</CardTitle>
              <CardDescription>
                إضافة وتعديل وحذف أفراد العائلة
              </CardDescription>
            </div>
            <Button onClick={onAddPerson} data-testid="button-add-person">
              <Plus className="ml-2 h-4 w-4" />
              إضافة فرد جديد
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث بالاسم..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
              data-testid="input-search"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم</TableHead>
                  <TableHead>السن</TableHead>
                  <TableHead>الإقامة</TableHead>
                  <TableHead>الصلاحية</TableHead>
                  <TableHead className="text-left">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPersons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      لا توجد نتائج
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPersons.map((person) => (
                    <TableRow key={person.id} data-testid={`row-person-${person.id}`}>
                      <TableCell className="font-medium">
                        {person.firstName} {person.lastName}
                      </TableCell>
                      <TableCell>{person.age || "-"}</TableCell>
                      <TableCell>{person.residence || "-"}</TableCell>
                      <TableCell>
                        {person.role && person.role !== "none" ? (
                          <Badge
                            variant={person.role === "admin" ? "default" : "secondary"}
                          >
                            {person.role === "admin" ? "مدير" : "مستخدم"}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">بدون حساب</span>
                        )}
                      </TableCell>
                      <TableCell className="text-left">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => onChangePassword?.(person.id)}
                            data-testid={`button-change-password-${person.id}`}
                          >
                            <Key className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => onEditPerson?.(person)}
                            data-testid={`button-edit-${person.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => onDeletePerson?.(person.id)}
                            data-testid={`button-delete-${person.id}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
