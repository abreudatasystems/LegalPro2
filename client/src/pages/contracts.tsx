import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Download,
  Filter,
  Search,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Copy,
  Send,
  Archive,
  Star,
  Users,
  DollarSign
} from "lucide-react";

type ContractStatus = 'rascunho' | 'revisao' | 'aprovado' | 'assinado' | 'ativo' | 'expirado' | 'cancelado';
type ContractType = 'prestacao_servicos' | 'consultoria' | 'trabalhista' | 'comercial' | 'locacao' | 'sociedade' | 'outros';
type Priority = 'baixa' | 'media' | 'alta' | 'urgente';

interface Contract {
  id: string;
  title: string;
  type: ContractType;
  status: ContractStatus;
  priority: Priority;
  clientId: string;
  clientName: string;
  value: number;
  startDate: Date;
  endDate?: Date;
  description: string;
  terms: string[];
  templateId?: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  tags: string[];
  attachments: string[];
  signatures: {
    party: string;
    signedAt?: Date;
    signed: boolean;
  }[];
  renewalDate?: Date;
  notificationDays: number;
}

interface ContractTemplate {
  id: string;
  name: string;
  type: ContractType;
  description: string;
  content: string;
  variables: string[];
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
  isDefault: boolean;
}

export default function Contracts() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingContract, setViewingContract] = useState<Contract | null>(null);
  const [newContract, setNewContract] = useState<Partial<Contract>>({
    type: 'prestacao_servicos',
    status: 'rascunho',
    priority: 'media',
    version: 1,
    notificationDays: 30,
    signatures: []
  });
  const [newTemplate, setNewTemplate] = useState<Partial<ContractTemplate>>({
    type: 'prestacao_servicos',
    variables: [],
    usageCount: 0,
    isDefault: false
  });
  const [filterStatus, setFilterStatus] = useState<'all' | ContractStatus>('all');
  const [filterType, setFilterType] = useState<'all' | ContractType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Acesso Negado",
        description: "Você não está autenticado. Redirecionando...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setIsLoadingData(true);
    setTimeout(() => {
      // Dados simulados realistas
      const mockContracts: Contract[] = [
        {
          id: '1',
          title: 'Contrato de Prestação de Serviços Jurídicos - Empresa ABC',
          type: 'prestacao_servicos',
          status: 'ativo',
          priority: 'alta',
          clientId: 'client-1',
          clientName: 'Empresa ABC Ltda',
          value: 50000,
          startDate: new Date(2024, 0, 15),
          endDate: new Date(2024, 11, 15),
          description: 'Prestação de serviços de consultoria jurídica empresarial',
          terms: [
            'Consultoria jurídica empresarial',
            'Análise de contratos',
            'Suporte em questões trabalhistas',
            'Representação em processos administrativos'
          ],
          version: 2,
          createdAt: new Date(2024, 0, 10),
          updatedAt: new Date(2024, 0, 20),
          createdBy: 'Dr. João Silva',
          tags: ['consultoria', 'empresarial', 'mensal'],
          attachments: ['contrato_abc_v2.pdf', 'anexo_servicos.pdf'],
          signatures: [
            { party: 'Escritório Jurídico', signed: true, signedAt: new Date(2024, 0, 15) },
            { party: 'Empresa ABC Ltda', signed: true, signedAt: new Date(2024, 0, 15) }
          ],
          renewalDate: new Date(2024, 10, 15),
          notificationDays: 30
        },
        {
          id: '2',
          title: 'Contrato Trabalhista - João Santos',
          type: 'trabalhista',
          status: 'revisao',
          priority: 'media',
          clientId: 'client-2',
          clientName: 'João Santos',
          value: 15000,
          startDate: new Date(2024, 11, 1),
          description: 'Contrato de trabalho para advogado júnior',
          terms: [
            'Carga horária: 40h semanais',
            'Salário: R$ 8.000',
            'Vale alimentação: R$ 800',
            'Plano de saúde incluído'
          ],
          version: 1,
          createdAt: new Date(2024, 10, 20),
          updatedAt: new Date(2024, 10, 25),
          createdBy: 'Dra. Maria Santos',
          tags: ['trabalhista', 'advogado', 'junior'],
          attachments: ['contrato_trabalho_joao.pdf'],
          signatures: [
            { party: 'Escritório Jurídico', signed: false },
            { party: 'João Santos', signed: false }
          ],
          notificationDays: 15
        },
        {
          id: '3',
          title: 'Acordo Comercial - Tech Solutions',
          type: 'comercial',
          status: 'rascunho',
          priority: 'urgente',
          clientId: 'client-3',
          clientName: 'Tech Solutions Inc',
          value: 120000,
          startDate: new Date(2025, 0, 1),
          endDate: new Date(2025, 11, 31),
          description: 'Acordo de parceria comercial estratégica',
          terms: [
            'Exclusividade territorial',
            'Metas de vendas trimestrais',
            'Comissões sobre vendas',
            'Suporte técnico incluído'
          ],
          version: 1,
          createdAt: new Date(2024, 11, 1),
          updatedAt: new Date(2024, 11, 5),
          createdBy: 'Dr. Carlos Oliveira',
          tags: ['comercial', 'parceria', 'tecnologia'],
          attachments: [],
          signatures: [
            { party: 'Escritório Jurídico', signed: false },
            { party: 'Tech Solutions Inc', signed: false }
          ],
          renewalDate: new Date(2025, 10, 1),
          notificationDays: 60
        }
      ];

      const mockTemplates: ContractTemplate[] = [
        {
          id: '1',
          name: 'Template Prestação de Serviços Jurídicos',
          type: 'prestacao_servicos',
          description: 'Template padrão para contratos de prestação de serviços jurídicos',
          content: 'CONTRATO DE PRESTAÇÃO DE SERVIÇOS JURÍDICOS\n\n[PARTES]\n[OBJETO]\n[PRAZO]\n[VALOR]\n[CLAUSULAS_ESPECIAIS]',
          variables: ['PARTES', 'OBJETO', 'PRAZO', 'VALOR', 'CLAUSULAS_ESPECIAIS'],
          createdAt: new Date(2024, 0, 1),
          updatedAt: new Date(2024, 5, 15),
          usageCount: 25,
          isDefault: true
        },
        {
          id: '2',
          name: 'Template Contrato Trabalhista',
          type: 'trabalhista',
          description: 'Template para contratos de trabalho',
          content: 'CONTRATO DE TRABALHO\n\n[EMPREGADOR]\n[EMPREGADO]\n[FUNCAO]\n[SALARIO]\n[BENEFICIOS]',
          variables: ['EMPREGADOR', 'EMPREGADO', 'FUNCAO', 'SALARIO', 'BENEFICIOS'],
          createdAt: new Date(2024, 1, 1),
          updatedAt: new Date(2024, 3, 20),
          usageCount: 12,
          isDefault: false
        }
      ];

      setContracts(mockContracts);
      setTemplates(mockTemplates);
      setIsLoadingData(false);
    }, 1000);
  };

  const getStatusColor = (status: ContractStatus) => {
    const colors = {
      rascunho: "bg-gray-100 text-gray-800",
      revisao: "bg-yellow-100 text-yellow-800",
      aprovado: "bg-blue-100 text-blue-800",
      assinado: "bg-green-100 text-green-800",
      ativo: "bg-green-100 text-green-800",
      expirado: "bg-red-100 text-red-800",
      cancelado: "bg-gray-100 text-gray-800"
    };
    return colors[status];
  };

  const getPriorityColor = (priority: Priority) => {
    const colors = {
      baixa: "bg-gray-100 text-gray-800",
      media: "bg-blue-100 text-blue-800",
      alta: "bg-orange-100 text-orange-800",
      urgente: "bg-red-100 text-red-800"
    };
    return colors[priority];
  };

  const getTypeLabel = (type: ContractType) => {
    const labels = {
      prestacao_servicos: 'Prestação de Serviços',
      consultoria: 'Consultoria',
      trabalhista: 'Trabalhista',
      comercial: 'Comercial',
      locacao: 'Locação',
      sociedade: 'Sociedade',
      outros: 'Outros'
    };
    return labels[type];
  };

  const getStatusIcon = (status: ContractStatus) => {
    const icons = {
      rascunho: Edit,
      revisao: Clock,
      aprovado: CheckCircle,
      assinado: CheckCircle,
      ativo: CheckCircle,
      expirado: AlertTriangle,
      cancelado: AlertTriangle
    };
    return icons[status];
  };

  const handleCreateContract = () => {
    if (!newContract.title || !newContract.clientName || !newContract.value) {
      toast({
        title: "Erro",
        description: "Título, cliente e valor são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const contract: Contract = {
      id: Date.now().toString(),
      title: newContract.title!,
      type: newContract.type!,
      status: newContract.status!,
      priority: newContract.priority!,
      clientId: newContract.clientId || 'temp-id',
      clientName: newContract.clientName!,
      value: newContract.value!,
      startDate: newContract.startDate || new Date(),
      endDate: newContract.endDate,
      description: newContract.description || '',
      terms: newContract.terms || [],
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'Usuário Atual',
      tags: newContract.tags || [],
      attachments: [],
      signatures: [
        { party: 'Escritório Jurídico', signed: false },
        { party: newContract.clientName!, signed: false }
      ],
      renewalDate: newContract.renewalDate,
      notificationDays: newContract.notificationDays || 30
    };

    setContracts([contract, ...contracts]);
    setNewContract({
      type: 'prestacao_servicos',
      status: 'rascunho',
      priority: 'media',
      version: 1,
      notificationDays: 30,
      signatures: []
    });
    setIsCreateDialogOpen(false);

    toast({
      title: "Sucesso",
      description: "Contrato criado com sucesso"
    });
  };

  const handleCreateTemplate = () => {
    if (!newTemplate.name || !newTemplate.content) {
      toast({
        title: "Erro",
        description: "Nome e conteúdo são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const template: ContractTemplate = {
      id: Date.now().toString(),
      name: newTemplate.name!,
      type: newTemplate.type!,
      description: newTemplate.description || '',
      content: newTemplate.content!,
      variables: newTemplate.variables || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0,
      isDefault: false
    };

    setTemplates([template, ...templates]);
    setNewTemplate({
      type: 'prestacao_servicos',
      variables: [],
      usageCount: 0,
      isDefault: false
    });
    setIsTemplateDialogOpen(false);

    toast({
      title: "Sucesso",
      description: "Template criado com sucesso"
    });
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesStatus = filterStatus === 'all' || contract.status === filterStatus;
    const matchesType = filterType === 'all' || contract.type === filterType;
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesStatus && matchesType && matchesSearch;
  });

  const getContractStats = () => {
    const total = contracts.length;
    const ativos = contracts.filter(c => c.status === 'ativo').length;
    const pendentes = contracts.filter(c => ['rascunho', 'revisao', 'aprovado'].includes(c.status)).length;
    const expirandoSoon = contracts.filter(c => 
      c.renewalDate && 
      new Date(c.renewalDate.getTime() - c.notificationDays * 24 * 60 * 60 * 1000) <= new Date()
    ).length;
    const valorTotal = contracts
      .filter(c => c.status === 'ativo')
      .reduce((sum, c) => sum + c.value, 0);

    return { total, ativos, pendentes, expirandoSoon, valorTotal };
  };

  const stats = getContractStats();

  if (isLoading || isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Carregando contratos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          title="Contratos & Minutas" 
          subtitle="Gestão completa de contratos, templates e documentos jurídicos"
          action={
            <div className="flex items-center space-x-3">
              <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Template
                  </Button>
                </DialogTrigger>
              </Dialog>
              <Button 
                onClick={() => window.location.href = '/contracts/create'}
                className="legal-button-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Contrato
              </Button>
            </div>
          }
        />

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Cards de estatísticas */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="legal-card hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total de Contratos</p>
                      <p className="text-2xl font-bold">{stats.total}</p>
                      <p className="text-sm text-gray-500">{stats.ativos} ativos</p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="legal-card hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Valor Total</p>
                      <p className="text-2xl font-bold text-green-600">
                        R$ {stats.valorTotal.toLocaleString('pt-BR')}
                      </p>
                      <p className="text-sm text-gray-500">Contratos ativos</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="legal-card hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pendentes</p>
                      <p className="text-2xl font-bold text-yellow-600">{stats.pendentes}</p>
                      <p className="text-sm text-gray-500">Aguardando ação</p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="legal-card hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Expirando</p>
                      <p className="text-2xl font-bold text-red-600">{stats.expirandoSoon}</p>
                      <p className="text-sm text-gray-500">Próximos 30 dias</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Abas principais */}
            <Tabs defaultValue="contracts" className="w-full">
              <TabsList className="grid w-full grid-cols-2 legal-card shadow-md">
                <TabsTrigger value="contracts" className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Contratos</span>
                </TabsTrigger>
                <TabsTrigger value="templates" className="flex items-center space-x-2">
                  <Copy className="w-4 h-4" />
                  <span>Templates</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="contracts" className="mt-6 space-y-6">
                {/* Filtros */}
                <Card className="legal-card">
                  <CardContent className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Buscar contratos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-64"
                          />
                        </div>
                        <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as any)}>
                          <SelectTrigger className="w-40">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos os status</SelectItem>
                            <SelectItem value="rascunho">Rascunho</SelectItem>
                            <SelectItem value="revisao">Em Revisão</SelectItem>
                            <SelectItem value="aprovado">Aprovado</SelectItem>
                            <SelectItem value="assinado">Assinado</SelectItem>
                            <SelectItem value="ativo">Ativo</SelectItem>
                            <SelectItem value="expirado">Expirado</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={filterType} onValueChange={(value) => setFilterType(value as any)}>
                          <SelectTrigger className="w-52">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos os tipos</SelectItem>
                            <SelectItem value="prestacao_servicos">Prestação de Serviços</SelectItem>
                            <SelectItem value="consultoria">Consultoria</SelectItem>
                            <SelectItem value="trabalhista">Trabalhista</SelectItem>
                            <SelectItem value="comercial">Comercial</SelectItem>
                            <SelectItem value="locacao">Locação</SelectItem>
                            <SelectItem value="sociedade">Sociedade</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Badge variant="outline">
                        {filteredContracts.length} contratos
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Lista de contratos */}
                <div className="grid gap-6">
                  {filteredContracts.map((contract) => {
                    const StatusIcon = getStatusIcon(contract.status);
                    return (
                      <Card key={contract.id} className="legal-card hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-3">
                                <StatusIcon className="w-5 h-5 text-gray-600" />
                                <h3 className="font-semibold text-lg">{contract.title}</h3>
                                <Badge className={getStatusColor(contract.status)}>
                                  {contract.status}
                                </Badge>
                                <Badge className={getPriorityColor(contract.priority)}>
                                  {contract.priority}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                  <p className="text-sm text-gray-600">Cliente</p>
                                  <p className="font-medium">{contract.clientName}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">Tipo</p>
                                  <p className="font-medium">{getTypeLabel(contract.type)}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">Valor</p>
                                  <p className="font-medium text-green-600">
                                    R$ {contract.value.toLocaleString('pt-BR')}
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <p className="text-sm text-gray-600">Início</p>
                                  <p className="font-medium">{contract.startDate.toLocaleDateString('pt-BR')}</p>
                                </div>
                                {contract.endDate && (
                                  <div>
                                    <p className="text-sm text-gray-600">Término</p>
                                    <p className="font-medium">{contract.endDate.toLocaleDateString('pt-BR')}</p>
                                  </div>
                                )}
                              </div>

                              {contract.description && (
                                <p className="text-sm text-gray-600 mb-4">{contract.description}</p>
                              )}

                              {/* Progresso das assinaturas */}
                              <div className="mb-4">
                                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                  <span>Assinaturas</span>
                                  <span>
                                    {contract.signatures.filter(s => s.signed).length} / {contract.signatures.length}
                                  </span>
                                </div>
                                <Progress 
                                  value={(contract.signatures.filter(s => s.signed).length / contract.signatures.length) * 100} 
                                  className="h-2" 
                                />
                                <div className="flex space-x-2 mt-2">
                                  {contract.signatures.map((sig, index) => (
                                    <Badge 
                                      key={index}
                                      className={sig.signed ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                                    >
                                      {sig.party} {sig.signed ? '✓' : '○'}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              {contract.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {contract.tags.map((tag, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col space-y-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setViewingContract(contract);
                                  setIsViewDialogOpen(true);
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Send className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="templates" className="mt-6 space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {templates.map((template) => (
                    <Card key={template.id} className="legal-card hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-2">{template.name}</h3>
                            <Badge className="mb-3">
                              {getTypeLabel(template.type)}
                            </Badge>
                            {template.isDefault && (
                              <Badge className="ml-2 bg-yellow-100 text-yellow-800">
                                <Star className="w-3 h-3 mr-1" />
                                Padrão
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <span>Usado {template.usageCount} vezes</span>
                          <span>{template.variables.length} variáveis</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Copy className="w-4 h-4 mr-2" />
                            Usar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Dialogs */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Criar Novo Contrato</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Título do Contrato</Label>
                      <Input
                        value={newContract.title || ''}
                        onChange={(e) => setNewContract({...newContract, title: e.target.value})}
                        placeholder="Título do contrato"
                      />
                    </div>
                    <div>
                      <Label>Cliente</Label>
                      <Input
                        value={newContract.clientName || ''}
                        onChange={(e) => setNewContract({...newContract, clientName: e.target.value})}
                        placeholder="Nome do cliente"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Tipo</Label>
                      <Select value={newContract.type} onValueChange={(value) => setNewContract({...newContract, type: value as ContractType})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="prestacao_servicos">Prestação de Serviços</SelectItem>
                          <SelectItem value="consultoria">Consultoria</SelectItem>
                          <SelectItem value="trabalhista">Trabalhista</SelectItem>
                          <SelectItem value="comercial">Comercial</SelectItem>
                          <SelectItem value="locacao">Locação</SelectItem>
                          <SelectItem value="sociedade">Sociedade</SelectItem>
                          <SelectItem value="outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Prioridade</Label>
                      <Select value={newContract.priority} onValueChange={(value) => setNewContract({...newContract, priority: value as Priority})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="baixa">Baixa</SelectItem>
                          <SelectItem value="media">Média</SelectItem>
                          <SelectItem value="alta">Alta</SelectItem>
                          <SelectItem value="urgente">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Valor (R$)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={newContract.value || ''}
                        onChange={(e) => setNewContract({...newContract, value: parseFloat(e.target.value)})}
                        placeholder="0,00"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Data de Início</Label>
                      <Input
                        type="date"
                        value={newContract.startDate ? newContract.startDate.toISOString().split('T')[0] : ''}
                        onChange={(e) => setNewContract({...newContract, startDate: new Date(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label>Data de Término (opcional)</Label>
                      <Input
                        type="date"
                        value={newContract.endDate ? newContract.endDate.toISOString().split('T')[0] : ''}
                        onChange={(e) => setNewContract({...newContract, endDate: e.target.value ? new Date(e.target.value) : undefined})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Descrição</Label>
                    <Textarea
                      value={newContract.description || ''}
                      onChange={(e) => setNewContract({...newContract, description: e.target.value})}
                      placeholder="Descrição do contrato"
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateContract}>
                      Criar Contrato
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Dialog de visualização */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Detalhes do Contrato</DialogTitle>
                </DialogHeader>
                {viewingContract && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-4">Informações Gerais</h3>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-600">Título</p>
                            <p className="font-medium">{viewingContract.title}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Cliente</p>
                            <p className="font-medium">{viewingContract.clientName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Tipo</p>
                            <p className="font-medium">{getTypeLabel(viewingContract.type)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Status</p>
                            <Badge className={getStatusColor(viewingContract.status)}>
                              {viewingContract.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-4">Valores e Prazos</h3>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-600">Valor</p>
                            <p className="font-medium text-green-600">
                              R$ {viewingContract.value.toLocaleString('pt-BR')}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Data de Início</p>
                            <p className="font-medium">{viewingContract.startDate.toLocaleDateString('pt-BR')}</p>
                          </div>
                          {viewingContract.endDate && (
                            <div>
                              <p className="text-sm text-gray-600">Data de Término</p>
                              <p className="font-medium">{viewingContract.endDate.toLocaleDateString('pt-BR')}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-sm text-gray-600">Prioridade</p>
                            <Badge className={getPriorityColor(viewingContract.priority)}>
                              {viewingContract.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {viewingContract.description && (
                      <div>
                        <h3 className="font-semibold mb-2">Descrição</h3>
                        <p className="text-gray-600">{viewingContract.description}</p>
                      </div>
                    )}

                    {viewingContract.terms.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Termos Principais</h3>
                        <ul className="list-disc list-inside space-y-1">
                          {viewingContract.terms.map((term, index) => (
                            <li key={index} className="text-gray-600">{term}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div>
                      <h3 className="font-semibold mb-2">Status das Assinaturas</h3>
                      <div className="space-y-2">
                        {viewingContract.signatures.map((sig, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded">
                            <span>{sig.party}</span>
                            <div className="flex items-center space-x-2">
                              {sig.signed ? (
                                <>
                                  <Badge className="bg-green-100 text-green-800">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Assinado
                                  </Badge>
                                  {sig.signedAt && (
                                    <span className="text-sm text-gray-500">
                                      {sig.signedAt.toLocaleDateString('pt-BR')}
                                    </span>
                                  )}
                                </>
                              ) : (
                                <Badge className="bg-gray-100 text-gray-800">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Pendente
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            {/* Dialog para template */}
            <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Criar Novo Template</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Nome do Template</Label>
                      <Input
                        value={newTemplate.name || ''}
                        onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                        placeholder="Nome do template"
                      />
                    </div>
                    <div>
                      <Label>Tipo</Label>
                      <Select value={newTemplate.type} onValueChange={(value) => setNewTemplate({...newTemplate, type: value as ContractType})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="prestacao_servicos">Prestação de Serviços</SelectItem>
                          <SelectItem value="consultoria">Consultoria</SelectItem>
                          <SelectItem value="trabalhista">Trabalhista</SelectItem>
                          <SelectItem value="comercial">Comercial</SelectItem>
                          <SelectItem value="locacao">Locação</SelectItem>
                          <SelectItem value="sociedade">Sociedade</SelectItem>
                          <SelectItem value="outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Descrição</Label>
                    <Textarea
                      value={newTemplate.description || ''}
                      onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                      placeholder="Descrição do template"
                    />
                  </div>

                  <div>
                    <Label>Conteúdo do Template</Label>
                    <Textarea
                      value={newTemplate.content || ''}
                      onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
                      placeholder="Conteúdo do template com variáveis [VARIAVEL]"
                      rows={10}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateTemplate}>
                      Criar Template
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  );
}