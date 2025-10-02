import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, X, User as UserIcon, Lock as LockIcon } from "lucide-react"; // Renamed User/Lock for clarity

const personFormSchema = z.object({
  id: z.string().optional(), // For update
  firstName: z.string().min(1, "الاسم الأول مطلوب"),
  lastName: z.string().min(1, "اسم العائلة مطلوب"),
  age: z.string().optional(),
  residence: z.string().optional(),
  occupation: z.string().optional(),
  bio: z.string().optional(),
  whatsapp: z.string().optional(),
  role: z.enum(["admin", "user", "none"]).default("none"),
  fatherId: z.string().optional(),
  motherId: z.string().optional(),
  spouseId: z.string().optional(),
  
  // New fields for User Account management
  newUsername: z.string().optional(),
  // New password is only required if the user sets a role, and is optional for existing users to keep current password
  newPassword: z.string().optional().or(z.literal("")), 
});

type PersonFormData = z.infer<typeof personFormSchema>;

interface Person {
  id: string;
  firstName: string;
  lastName: string;
}

interface PersonFormProps {
  initialData?: Partial<PersonFormData> & { newUsername?: string }; // Include newUsername for form pre-fill
  availablePersons?: Person[];
  onSubmit: (data: PersonFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function PersonForm({
  initialData,
  availablePersons = [],
  onSubmit,
  onCancel,
  isLoading = false,
}: PersonFormProps) {
  const form = useForm<PersonFormData>({
    resolver: zodResolver(personFormSchema),
    defaultValues: {
      id: initialData?.id || undefined,
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      age: initialData?.age || "",
      residence: initialData?.residence || "",
      occupation: initialData?.occupation || "",
      bio: initialData?.bio || "",
      whatsapp: initialData?.whatsapp || "",
      role: initialData?.role || "none",
      fatherId: initialData?.fatherId || "",
      motherId: initialData?.motherId || "",
      spouseId: initialData?.spouseId || "",
      newUsername: initialData?.newUsername || "",
      newPassword: "", // Never pre-fill password
    },
  });
  
  const selectedRole = form.watch("role");

  const handleSubmit = (data: PersonFormData) => {
    // Convert empty strings to undefined to match server expectations
    const finalData = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, value === "" ? undefined : value])
    ) as PersonFormData;
    
    // Clear username/password fields if role is 'none'
    if (finalData.role === 'none') {
         finalData.newUsername = undefined;
         finalData.newPassword = undefined;
    }
    
    onSubmit(finalData);
  };
  
  const isEditMode = !!initialData?.id;

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>
          {isEditMode ? "تعديل بيانات فرد" : "إضافة فرد جديد"}
        </CardTitle>
        <CardDescription>
          أدخل المعلومات الأساسية للفرد وحدد العلاقات العائلية
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم الأول *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="أحمد" data-testid="input-firstName" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم العائلة *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="السالم" data-testid="input-lastName" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>السن</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        placeholder="30" 
                        data-testid="input-age" 
                        onChange={(e) => {
                            // Only allow positive integers or empty string
                            const value = e.target.value;
                            if (value === "" || /^\d+$/.test(value)) {
                                field.onChange(value);
                            }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="residence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الإقامة</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="الرياض" data-testid="input-residence" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>العمل</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="مهندس" data-testid="input-occupation" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الواتساب (للعرض الخاص)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="+966501234567"
                        dir="ltr"
                        data-testid="input-whatsapp"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نبذة</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="نبذة مختصرة عن الفرد..."
                      className="resize-none min-h-[100px]"
                      data-testid="input-bio"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <h3 className="text-lg font-semibold mt-6 pt-4 border-t border-border">إدارة الحساب والصلاحيات</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الصلاحية</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-role">
                          <SelectValue placeholder="اختر الصلاحية" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">بدون حساب</SelectItem>
                        <SelectItem value="user">مستخدم (تعديل بياناته فقط)</SelectItem>
                        <SelectItem value="admin">مدير (تعديل كل شيء)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      تحديد صلاحيات الوصول وتعديل البيانات.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {(selectedRole === "admin" || selectedRole === "user") && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border">
                    <FormField
                      control={form.control}
                      name="newUsername"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>اسم المستخدم {selectedRole !== 'none' ? '*' : ''}</FormLabel>
                          <FormControl>
                            <div className="relative">
                                <UserIcon className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  {...field} 
                                  placeholder="username" 
                                  className="pr-10"
                                  dir="ltr"
                                  data-testid="input-username"
                                />
                            </div>
                          </FormControl>
                          <FormDescription>يستخدم لتسجيل الدخول.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>كلمة المرور {isEditMode ? "(للتغيير فقط)" : '*'}</FormLabel>
                          <FormControl>
                            <div className="relative">
                                <LockIcon className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  {...field} 
                                  type="password" 
                                  placeholder={isEditMode ? "اترك فارغاً للإبقاء على كلمة المرور الحالية" : "كلمة المرور"} 
                                  className="pr-10"
                                  dir="ltr"
                                  data-testid="input-password"
                                />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
            )}


            <h3 className="text-lg font-semibold mt-6 pt-4 border-t border-border">العلاقات العائلية</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fatherId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الأب</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger data-testid="select-father">
                          <SelectValue placeholder="اختر الأب" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">بدون</SelectItem>
                        {availablePersons.map((person) => (
                          <SelectItem key={person.id} value={person.id}>
                            {person.firstName} {person.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="motherId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الأم</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger data-testid="select-mother">
                          <SelectValue placeholder="اختر الأم" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">بدون</SelectItem>
                        {availablePersons.map((person) => (
                          <SelectItem key={person.id} value={person.id}>
                            {person.firstName} {person.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="spouseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الزوج/الزوجة</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger data-testid="select-spouse">
                          <SelectValue placeholder="اختر الزوج/الزوجة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">بدون</SelectItem>
                        {availablePersons.map((person) => (
                          <SelectItem key={person.id} value={person.id}>
                            {person.firstName} {person.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Note: Side relations are complex and require a dedicated component. Skipping for basic MVP */}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
                data-testid="button-submit"
              >
                <Save className="ml-2 h-4 w-4" />
                {isLoading ? "جاري الحفظ..." : "حفظ"}
              </Button>
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                  data-testid="button-cancel"
                >
                  <X className="ml-2 h-4 w-4" />
                  إلغاء
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
