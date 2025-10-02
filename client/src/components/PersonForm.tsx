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
import { Save, X } from "lucide-react";

const personFormSchema = z.object({
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
});

type PersonFormData = z.infer<typeof personFormSchema>;

interface Person {
  id: string;
  firstName: string;
  lastName: string;
}

interface PersonFormProps {
  initialData?: Partial<PersonFormData>;
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
    },
  });

  const handleSubmit = (data: PersonFormData) => {
    console.log("Form submitted:", data);
    onSubmit(data);
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>
          {initialData?.firstName ? "تعديل بيانات فرد" : "إضافة فرد جديد"}
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
                      <Input {...field} type="number" placeholder="30" data-testid="input-age" />
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
                    <FormLabel>رقم الواتساب</FormLabel>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الصلاحية</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-role">
                          <SelectValue placeholder="اختر الصلاحية" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">بدون حساب</SelectItem>
                        <SelectItem value="user">مستخدم</SelectItem>
                        <SelectItem value="admin">مدير</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      المدير يمكنه تعديل كل شيء، المستخدم يعدل بياناته فقط
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fatherId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الأب</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
