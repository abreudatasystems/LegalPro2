
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
  Building2,
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
  Truck,
  Package,
  Settings
} from "lucide-react";

type SupplierType = 'servicos' | 'produtos' | 'tecnologia' | 'consultoria' | 'manutencao' | 'outros';
type SupplierStatus = 'ativo' | 'inativo' | 'pendente' | 'bloqueado';

interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string; // CNPJ
  type: SupplierType;
  status: SupplierStatus;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  website?: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  category: string;
  rating: number;
  totalContracts: number;
  totalValue: number;
  lastContract: Date;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function Suppliers() {
  const { toast } = useToast();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [viewingSupplier, setViewingSupplier] = useState<Supplier | null>(null);
  const [filterType, setFilterType] = useState<'all' | SupplierType>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | SupplierStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({
    type: 'servicos',
    status: 'ativo',
    rating: 5
  });

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setSuppliers([
        {
          id: '1',
          name: 'TechSolution Ltda',
          email: 'contato@techsolution.com.br',
          phone: '(11) 3456-7890',
          document: '12.345.678/0001-90',
          type: 'tecnologia',
          status: 'ativo',
          address: 'Rua da Tecnologia, 123',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234-567',
          website: 'www.techsolution.com.br',
          contactPerson: 'João Silva',
          contactPhone: '(11) 99999-8888',
          contactEmail: 'joao@techsolution.com.br',
          category: 'Software Jurídico',
          rating: 5,
          totalContracts: 8,
          totalValue: 250000,
          lastContract: new Date('2024-01-15'),
          notes: 'Fornecedor de sistemas jurídicos e consultoria em TI',
          createdAt: new Date('2023-03-15'),
          updatedAt: new Date('2024-01-20')
        },
        {
          id: '2',
          name: 'LegalSupplies Corp',
          email: 'vendas@legalsupplies.com.br',
          phone: '(21) 2345-6789',
          document: '98.765.432/0001-10',
          type: 'produtos',
          status: 'ativo',
          address: 'Av. dos Fornecedores, 456',
          city: 'Rio de Janeiro',
          state: 'RJ',
          zipCode: '20000-000',
          contactPerson: 'Maria Santos',
          contactPhone: '(21) 88888-7777',
          contactEmail: 'maria@legalsupplies.com.br',
          category: 'Material de Escritório',
          rating: 4,
          totalContracts: 15,
          totalValue: 85000,
          lastContract: new Date('2024-01-10'),
          notes: 'Fornecedor de materiais de escritório e mobiliário',
          createdAt: new Date('2022-08-20'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: '3',
          name: 'Consultoria Jurídica Premium',
          email: 'contato@cjpremium.com.br',
          phone: '(31) 3333-4444',
          document: '11.222.333/0001-44',
          type: 'consultoria',
          status: 'ativo',
          address: 'Rua dos Consultores, 789',
          city: 'Belo Horizonte',
          state: 'MG',
          zipCode: '30000-000',
          contactPerson: 'Dr. Carlos Mendes',
          contactPhone: '(31) 77777-6666',
          contactEmail: 'carlos@cjpremium.com.br',
          category: 'Consultoria Especializada',
          rating: 5,
          totalContracts: 5,
          totalValue: 180000,
          lastContract: new Date('2023-12-20'),
          notes: 'Consultoria especializada em direito tributário',
          createdAt: new Date('2023-01-10'),
          updatedAt: new Date('2023-12-25')
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getTypeLabel = (type: SupplierType) => {
    const labels = {
      servicos: 'Serviços',
      produtos: 'Produtos',
      tecnologia: 'Tecnologia',
      consultoria: 'Consultoria',
      manutencao: 'Manutenção',
      outros: 'Outros'
    };
    return labels[type];
  };

  const getStatusColor = (status: SupplierStatus) => {
    const colors = {
      ativo: "bg-green-100 text-green-800",
      inativo: "bg-gray-100 text-gray-800",
      pendente: "bg-yellow-100 text-yellow-800",
      bloqueado: "bg-red-100 text-red-800"
    };
    return colors[status];
  };

  const getTypeColor = (type: SupplierType) => {
    const colors = {
      servicos: "bg-blue-100 text-blue-800",
      produtos: "bg-purple-100 text-purple-800",
      tecnologia: "bg-green-100 text-green-800",
      consultoria: "bg-orange-100 text-orange-800",
      manutencao: "bg-gray-100 text-gray-800",
      outros: "bg-pink-100 text-pink-800"
    };
    return colors[type];
  };

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesType = filterType === 'all' || supplier.type === filterType;
    const matchesStatus = filterStatus === 'all' || supplier.status === filterStatus;
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.document.includes(searchTerm) ||
                         supplier.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesStatus && matchesSearch;
  });

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newSupplier.name || !newSupplier.email) {
      toast({
        title: "Erro",
        description: "Nome e email são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const supplier: Supplier = {
      id: Date.now().toString(),
      name: newSupplier.name!,
      email: newSupplier.email!,
      phone: newSupplier.phone || '',
      document: newSupplier.document || '',
      type: newSupplier.type as SupplierType,
      status: newSupplier.status as SupplierStatus,
      address: newSupplier.address || '',
      city: newSupplier.city || '',
      state: newSupplier.state || '',
      zipCode: newSupplier.zipCode || '',
      website: newSupplier.website,
      contactPerson: newSupplier.contactPerson || '',
      contactPhone: newSupplier.contactPhone || '',
      contactEmail: newSupplier.contactEmail || '',
      category: newSupplier.category || '',
      rating: newSupplier.rating || 5,
      totalContracts: 0,
      totalValue: 0,
      lastContract: new Date(),
      notes: newSupplier.notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setSuppliers([supplier, ...suppliers]);
    setNewSupplier({
      type: 'servicos',
      status: 'ativo',
      rating: 5
    });
    setShowCreateForm(false);

    toast({
      title: "Sucesso",
      description: "Fornecedor criado com sucesso"
    });
  };

  const supplierStats = [
    { label: "Total de Fornecedores", value: suppliers.length, variant: 'default' },
    { label: "Ativos", value: suppliers.filter(s => s.status === 'ativo').length, variant: 'success' },
    { label: "Contratos Ativos", value: suppliers.reduce((sum, s) => sum + s.totalContracts, 0), variant: 'default' },
    { label: "Valor Total", value: `R$ ${suppliers.reduce((sum, s) => sum + s.totalValue, 0).toLocaleString('pt-BR')}`, variant: 'success' }
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          title="Gestão de Fornecedores" 
          subtitle="Gerencie fornecedores e parcerias do escritório"
          action={
            <Button 
              onClick={() => window.location.href = '/suppliers/create'}
              className="legal-button-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Fornecedor
            </Button>
          }
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <PageHeader
              title="Gestão de Fornecedores"
              subtitle="Central de controle de fornecedores e parcerias estratégicas"
              stats={supplierStats}
            />

            {/* Search and Filters */}
            <Card className="legal-card">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar fornecedores..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={filterType} onValueChange={(value) => setFilterType(value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Tipos</SelectItem>
                      <SelectItem value="servicos">Serviços</SelectItem>
                      <SelectItem value="produtos">Produtos</SelectItem>
                      <SelectItem value="tecnologia">Tecnologia</SelectItem>
                      <SelectItem value="consultoria">Consultoria</SelectItem>
                      <SelectItem value="manutencao">Manutenção</SelectItem>
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
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="bloqueado">Bloqueado</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" className="w-full">
                    <Filter className="w-4 h-4 mr-2" />
                    Limpar Filtros
                  </Button>
                </div>
              </CardContent>
            </Card>

            

            {/* Suppliers List */}
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
              ) : filteredSuppliers.length === 0 ? (
                <Card className="legal-card">
                  <CardContent className="p-8 text-center">
                    <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {searchTerm ? "Nenhum fornecedor encontrado" : "Nenhum fornecedor cadastrado"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <Card key={supplier.id} className="legal-card hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${supplier.name}`} />
                            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                              {supplier.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center space-x-3">
                              <h3 className="font-semibold text-lg">{supplier.name}</h3>
                              <Badge className={getStatusColor(supplier.status)}>
                                {supplier.status}
                              </Badge>
                              <Badge className={getTypeColor(supplier.type)}>
                                {getTypeLabel(supplier.type)}
                              </Badge>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < supplier.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4 text-gray-500" />
                                <span>{supplier.email}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4 text-gray-500" />
                                <span>{supplier.phone}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                <span>{supplier.city}, {supplier.state}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <FileText className="w-4 h-4 text-gray-500" />
                                <span>{supplier.document}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div className="flex items-center space-x-2">
                                <Package className="w-4 h-4 text-blue-500" />
                                <span className="font-medium">{supplier.totalContracts} contratos</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <DollarSign className="w-4 h-4 text-green-500" />
                                <span className="font-medium">R$ {supplier.totalValue.toLocaleString('pt-BR')}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-purple-500" />
                                <span className="font-medium">{supplier.lastContract.toLocaleDateString('pt-BR')}</span>
                              </div>
                            </div>

                            {supplier.notes && (
                              <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                                {supplier.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setViewingSupplier(supplier)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setEditingSupplier(supplier)}
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
