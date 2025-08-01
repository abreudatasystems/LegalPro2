
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus,
  Search,
  Filter,
  User,
  Phone,
  Mail,
  MapPin,
  Edit,
  Trash2,
  Eye,
  Star,
  Calendar,
  DollarSign,
  FileText,
  Briefcase,
  GraduationCap,
  Building,
  Users
} from "lucide-react";

type EmployeeRole = 'socio' | 'advogado_senior' | 'advogado_junior' | 'estagiario' | 'secretaria' | 'administrativo' | 'outros';
type EmployeeStatus = 'ativo' | 'inativo' | 'ferias' | 'afastado' | 'demitido';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string; // CPF
  oab?: string;
  role: EmployeeRole;
  status: EmployeeStatus;
  department: string;
  salary: number;
  hireDate: Date;
  birthDate: Date;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  emergencyContact: string;
  emergencyPhone: string;
  education: string;
  specializations: string[];
  performanceRating: number;
  completedTasks: number;
  activeCases: number;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function Employees() {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [filterRole, setFilterRole] = useState<'all' | EmployeeRole>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | EmployeeStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
    role: 'advogado_junior',
    status: 'ativo',
    performanceRating: 5,
    specializations: []
  });

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setEmployees([
        {
          id: '1',
          name: 'Dr. João Silva',
          email: 'joao.silva@escritorio.com.br',
          phone: '(11) 99999-8888',
          document: '123.456.789-00',
          oab: 'OAB/SP 123456',
          role: 'socio',
          status: 'ativo',
          department: 'Direito Civil',
          salary: 25000,
          hireDate: new Date('2020-01-15'),
          birthDate: new Date('1985-03-20'),
          address: 'Rua dos Advogados, 123',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234-567',
          emergencyContact: 'Maria Silva',
          emergencyPhone: '(11) 88888-7777',
          education: 'Doutor em Direito Civil - USP',
          specializations: ['Direito Civil', 'Direito de Família', 'Direito Imobiliário'],
          performanceRating: 5,
          completedTasks: 156,
          activeCases: 23,
          notes: 'Sócio fundador, especialista em direito civil e de família',
          createdAt: new Date('2020-01-15'),
          updatedAt: new Date('2024-01-20')
        },
        {
          id: '2',
          name: 'Dra. Maria Santos',
          email: 'maria.santos@escritorio.com.br',
          phone: '(11) 77777-6666',
          document: '987.654.321-00',
          oab: 'OAB/SP 654321',
          role: 'advogado_senior',
          status: 'ativo',
          department: 'Direito Trabalhista',
          salary: 18000,
          hireDate: new Date('2021-03-10'),
          birthDate: new Date('1988-07-15'),
          address: 'Av. da Justiça, 456',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '02345-678',
          emergencyContact: 'Pedro Santos',
          emergencyPhone: '(11) 66666-5555',
          education: 'Mestre em Direito Trabalhista - PUC-SP',
          specializations: ['Direito Trabalhista', 'Direito Sindical', 'Direito Previdenciário'],
          performanceRating: 5,
          completedTasks: 134,
          activeCases: 18,
          notes: 'Especialista em direito trabalhista, excelente histórico de vitórias',
          createdAt: new Date('2021-03-10'),
          updatedAt: new Date('2024-01-18')
        },
        {
          id: '3',
          name: 'Carlos Oliveira',
          email: 'carlos.oliveira@escritorio.com.br',
          phone: '(11) 55555-4444',
          document: '456.789.123-00',
          oab: 'OAB/SP 789123',
          role: 'advogado_junior',
          status: 'ativo',
          department: 'Direito Empresarial',
          salary: 12000,
          hireDate: new Date('2022-08-20'),
          birthDate: new Date('1992-11-30'),
          address: 'Rua do Comércio, 789',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '03456-789',
          emergencyContact: 'Ana Oliveira',
          emergencyPhone: '(11) 44444-3333',
          education: 'Bacharel em Direito - Mackenzie',
          specializations: ['Direito Empresarial', 'Direito Tributário'],
          performanceRating: 4,
          completedTasks: 89,
          activeCases: 12,
          notes: 'Advogado junior com bom potencial, especialização em direito empresarial',
          createdAt: new Date('2022-08-20'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: '4',
          name: 'Ana Beatriz Costa',
          email: 'ana.costa@escritorio.com.br',
          phone: '(11) 33333-2222',
          document: '321.654.987-00',
          role: 'estagiario',
          status: 'ativo',
          department: 'Suporte Jurídico',
          salary: 2500,
          hireDate: new Date('2023-06-01'),
          birthDate: new Date('1999-05-12'),
          address: 'Rua dos Estudantes, 321',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '04567-890',
          emergencyContact: 'Roberto Costa',
          emergencyPhone: '(11) 22222-1111',
          education: '8º semestre - Direito FGV',
          specializations: ['Pesquisa Jurídica', 'Suporte Administrativo'],
          performanceRating: 4,
          completedTasks: 45,
          activeCases: 5,
          notes: 'Estagiária dedicada, cursando último ano de direito',
          createdAt: new Date('2023-06-01'),
          updatedAt: new Date('2024-01-10')
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getRoleLabel = (role: EmployeeRole) => {
    const labels = {
      socio: 'Sócio',
      advogado_senior: 'Advogado Sênior',
      advogado_junior: 'Advogado Júnior',
      estagiario: 'Estagiário',
      secretaria: 'Secretária',
      administrativo: 'Administrativo',
      outros: 'Outros'
    };
    return labels[role];
  };

  const getStatusColor = (status: EmployeeStatus) => {
    const colors = {
      ativo: "bg-green-100 text-green-800",
      inativo: "bg-gray-100 text-gray-800",
      ferias: "bg-blue-100 text-blue-800",
      afastado: "bg-yellow-100 text-yellow-800",
      demitido: "bg-red-100 text-red-800"
    };
    return colors[status];
  };

  const getRoleColor = (role: EmployeeRole) => {
    const colors = {
      socio: "bg-purple-100 text-purple-800",
      advogado_senior: "bg-blue-100 text-blue-800",
      advogado_junior: "bg-green-100 text-green-800",
      estagiario: "bg-orange-100 text-orange-800",
      secretaria: "bg-pink-100 text-pink-800",
      administrativo: "bg-gray-100 text-gray-800",
      outros: "bg-yellow-100 text-yellow-800"
    };
    return colors[role];
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesRole = filterRole === 'all' || employee.role === filterRole;
    const matchesStatus = filterStatus === 'all' || employee.status === filterStatus;
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.document.includes(searchTerm) ||
                         (employee.oab && employee.oab.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesRole && matchesStatus && matchesSearch;
  });

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEmployee.name || !newEmployee.email) {
      toast({
        title: "Erro",
        description: "Nome e email são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const employee: Employee = {
      id: Date.now().toString(),
      name: newEmployee.name!,
      email: newEmployee.email!,
      phone: newEmployee.phone || '',
      document: newEmployee.document || '',
      oab: newEmployee.oab,
      role: newEmployee.role as EmployeeRole,
      status: newEmployee.status as EmployeeStatus,
      department: newEmployee.department || '',
      salary: newEmployee.salary || 0,
      hireDate: newEmployee.hireDate || new Date(),
      birthDate: newEmployee.birthDate || new Date(),
      address: newEmployee.address || '',
      city: newEmployee.city || '',
      state: newEmployee.state || '',
      zipCode: newEmployee.zipCode || '',
      emergencyContact: newEmployee.emergencyContact || '',
      emergencyPhone: newEmployee.emergencyPhone || '',
      education: newEmployee.education || '',
      specializations: newEmployee.specializations || [],
      performanceRating: newEmployee.performanceRating || 5,
      completedTasks: 0,
      activeCases: 0,
      notes: newEmployee.notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setEmployees([employee, ...employees]);
    setNewEmployee({
      role: 'advogado_junior',
      status: 'ativo',
      performanceRating: 5,
      specializations: []
    });
    setShowCreateForm(false);

    toast({
      title: "Sucesso",
      description: "Funcionário criado com sucesso"
    });
  };

  const employeeStats = [
    { label: "Total de Funcionários", value: employees.length, variant: 'default' },
    { label: "Ativos", value: employees.filter(e => e.status === 'ativo').length, variant: 'success' },
    { label: "Advogados", value: employees.filter(e => e.role.includes('advogado') || e.role === 'socio').length, variant: 'default' },
    { label: "Casos Ativos", value: employees.reduce((sum, e) => sum + e.activeCases, 0), variant: 'default' }
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          title="Gestão de Funcionários" 
          subtitle="Gerencie equipe e recursos humanos do escritório"
          action={
            <Button 
              onClick={() => window.location.href = '/employees/create'}
              className="legal-button-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Funcionário
            </Button>
          }
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <PageHeader
              title="Gestão de Funcionários"
              subtitle="Central de recursos humanos e gestão de equipe"
              stats={employeeStats}
            />

            {/* Search and Filters */}
            <Card className="legal-card">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar funcionários..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={filterRole} onValueChange={(value) => setFilterRole(value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Cargos</SelectItem>
                      <SelectItem value="socio">Sócio</SelectItem>
                      <SelectItem value="advogado_senior">Advogado Sênior</SelectItem>
                      <SelectItem value="advogado_junior">Advogado Júnior</SelectItem>
                      <SelectItem value="estagiario">Estagiário</SelectItem>
                      <SelectItem value="secretaria">Secretária</SelectItem>
                      <SelectItem value="administrativo">Administrativo</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Status</SelectItem>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                      <SelectItem value="ferias">Férias</SelectItem>
                      <SelectItem value="afastado">Afastado</SelectItem>
                      <SelectItem value="demitido">Demitido</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" className="w-full">
                    <Filter className="w-4 h-4 mr-2" />
                    Limpar Filtros
                  </Button>
                </div>
              </CardContent>
            </Card>

            

            {/* Employees List */}
            <div className="grid gap-4">
              {isLoading ? (
                <div className="grid gap-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                          <div className="space-y-2 flex-1">
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredEmployees.length === 0 ? (
                <Card className="legal-card">
                  <CardContent className="p-8 text-center">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {searchTerm ? "Nenhum funcionário encontrado" : "Nenhum funcionário cadastrado"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredEmployees.map((employee) => (
                  <Card key={employee.id} className="legal-card hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.name}`} />
                            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                              {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center space-x-3">
                              <h3 className="font-semibold text-lg">{employee.name}</h3>
                              <Badge className={getStatusColor(employee.status)}>
                                {employee.status}
                              </Badge>
                              <Badge className={getRoleColor(employee.role)}>
                                {getRoleLabel(employee.role)}
                              </Badge>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < employee.performanceRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4 text-gray-500" />
                                <span>{employee.email}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4 text-gray-500" />
                                <span>{employee.phone}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Building className="w-4 h-4 text-gray-500" />
                                <span>{employee.department}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <GraduationCap className="w-4 h-4 text-gray-500" />
                                <span>{employee.oab || 'N/A'}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div className="flex items-center space-x-2">
                                <Briefcase className="w-4 h-4 text-blue-500" />
                                <span className="font-medium">{employee.activeCases} casos ativos</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <FileText className="w-4 h-4 text-green-500" />
                                <span className="font-medium">{employee.completedTasks} tarefas concluídas</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-purple-500" />
                                <span className="font-medium">Desde {employee.hireDate.toLocaleDateString('pt-BR')}</span>
                              </div>
                            </div>

                            {employee.specializations.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {employee.specializations.map((spec, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {spec}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {employee.notes && (
                              <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                                {employee.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setViewingEmployee(employee)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setEditingEmployee(employee)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
