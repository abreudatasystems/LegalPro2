import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import OverviewCards from "@/components/dashboard/overview-cards";
import RevenueChart from "@/components/dashboard/revenue-chart";
import RecentActivities from "@/components/dashboard/recent-activities";
import QuickActions from "@/components/dashboard/quick-actions";
import UpcomingEvents from "@/components/dashboard/upcoming-events";
import Calendar from "@/components/dashboard/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

import { NotificationBell, Notification } from "@/components/ui/notification-bell";
import { PageHeader } from "@/components/ui/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Activity,
  Calendar as CalendarIcon,
  BarChart3,
  Clock,
  DollarSign,
  RefreshCw,
  AlertTriangle,
  Bell,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Target,
  Plus,
  Filter,
  Download,
  Eye,
  MoreHorizontal,
  Briefcase,
  Building,
  Scale
} from "lucide-react";

// Tipos expandidos
type TaskPriority = 'baixa' | 'media' | 'alta' | 'urgente';
type TaskStatus = 'pendente' | 'em_andamento' | 'concluida' | 'cancelada';

type Task = {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: Date;
  assignedTo: string;
  clientId?: string;
  projectId?: string;
  category: 'legal' | 'administrativa' | 'comercial' | 'financeira';
  progress: number;
  estimatedHours: number;
  actualHours: number;
};

type DashboardStats = {
  totalRevenue: number;
  activeContracts: number;
  revenueGrowth: number;
  pendingTasks: number;
  completedTasks: number;
  clientsCount: number;
  projectsCount: number;
  upcomingDeadlines: number;
  averageTaskCompletion: number;
  monthlyGoal: number;
  teamProductivity: number;
  urgentTasks: number;
  activeCases: number;
  scheduledHearings: number;
  newClientsThisMonth: number;
};

type CalendarEvent = {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  type: 'audiencia' | 'reuniao' | 'prazo' | 'consulta' | 'outro';
  priority: 'alta' | 'media' | 'baixa';
  location?: string;
  participants?: string[];
  clientId?: string;
  taskId?: string;
};

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('30d');
  const [activeView, setActiveView] = useState('overview');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [taskFilter, setTaskFilter] = useState<'all' | TaskStatus>('all');

  const toastShown = useRef(false);
  const { toast } = useToast();

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return AlertTriangle;
      case 'warning':
        return Clock;
      case 'info':
        return CheckCircle;
      default:
        return AlertTriangle;
    }
  };

  const renderAlertIcon = (type: string) => {
    const IconComponent = getAlertIcon(type);
    return <IconComponent className="w-4 h-4" />;
  };

  // Fetch de dados reais
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      // Dados reais simulados expandidos
      setStats({
        totalRevenue: 485750,
        activeContracts: 67,
        revenueGrowth: 18.3,
        pendingTasks: 23,
        completedTasks: 156,
        clientsCount: 89,
        projectsCount: 34,
        upcomingDeadlines: 12,
        averageTaskCompletion: 87.5,
        monthlyGoal: 500000,
        teamProductivity: 92.3,
        urgentTasks: 5,
        activeCases: 42,
        scheduledHearings: 8,
        newClientsThisMonth: 12
      });

      setTasks([
        {
          id: '1',
          title: 'Análise de Contrato Comercial - ABC Corp',
          description: 'Revisar cláusulas do contrato da empresa XYZ com foco em questões tributárias',
          priority: 'alta',
          status: 'em_andamento',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          assignedTo: 'Dr. João Silva',
          clientId: 'client-1',
          category: 'legal',
          progress: 65,
          estimatedHours: 8,
          actualHours: 5.2
        },
        {
          id: '2',
          title: 'Preparação para Audiência Trabalhista',
          description: 'Preparar documentação completa para audiência no TRT - 5ª Região',
          priority: 'urgente',
          status: 'pendente',
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          assignedTo: 'Dra. Maria Santos',
          category: 'legal',
          progress: 30,
          estimatedHours: 12,
          actualHours: 3.5
        },
        {
          id: '3',
          title: 'Relatório Financeiro Mensal',
          description: 'Compilar relatório detalhado de receitas, despesas e indicadores',
          priority: 'media',
          status: 'concluida',
          dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          assignedTo: 'Carlos Oliveira',
          category: 'financeira',
          progress: 100,
          estimatedHours: 6,
          actualHours: 5.8
        },
        {
          id: '4',
          title: 'Due Diligence - Tech Startup',
          description: 'Análise completa de documentação societária e compliance',
          priority: 'alta',
          status: 'em_andamento',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          assignedTo: 'Dr. Roberto Lima',
          category: 'comercial',
          progress: 45,
          estimatedHours: 20,
          actualHours: 9
        }
      ]);

      setEvents([
        {
          id: '1',
          title: 'Audiência - Processo Trabalhista 1234567',
          description: 'Audiência de instrução e julgamento - Reclamação trabalhista',
          date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          time: '14:30',
          type: 'audiencia',
          priority: 'alta',
          location: 'TRT - 5ª Região, Sala 308',
          participants: ['Dra. Maria Santos', 'Cliente: Pedro Costa'],
          taskId: '2'
        },
        {
          id: '2',
          title: 'Reunião Estratégica - Cliente ABC Corp',
          description: 'Discussão sobre expansão de serviços jurídicos e novos contratos',
          date: new Date(),
          time: '16:00',
          type: 'reuniao',
          priority: 'alta',
          location: 'Escritório - Sala de Reuniões Principal',
          participants: ['Dr. João Silva', 'Cliente: Empresa ABC']
        },
        {
          id: '3',
          title: 'Prazo - Recurso Especial STJ',
          description: 'Vencimento do prazo para interposição de recurso especial',
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          time: '17:00',
          type: 'prazo',
          priority: 'alta',
          location: 'STJ - Brasília',
          participants: ['Dr. Carlos Meneses']
        }
      ]);

      setNotifications([
        {
          id: '1',
          type: 'error',
          title: 'Prazo Crítico - Audiência Amanhã!',
          message: 'Audiência trabalhista agendada para amanhã às 14:30h. Documentação ainda não foi finalizada.',
          timestamp: new Date(),
          read: false,
          priority: 1
        },
        {
          id: '2',
          type: 'warning',
          title: 'Meta Mensal - 97% Atingida',
          message: 'Faltam apenas R$ 14.250 para atingir a meta de receita do mês. Excelente progresso!',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          read: false,
          priority: 2
        },
        {
          id: '3',
          type: 'success',
          title: 'Novo Cliente Cadastrado',
          message: 'Cliente "Inovação Tech Ltda" foi adicionado ao sistema com contrato de R$ 25.000/mês.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: false,
          priority: 3
        },
        {
          id: '4',
          type: 'info',
          title: 'Relatório Mensal Disponível',
          message: 'O relatório de performance de dezembro já está disponível para análise.',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          read: true,
          priority: 4
        },
        {
          id: '5',
          type: 'warning',
          title: 'Backup do Sistema',
          message: 'Backup automático será executado hoje às 23:00h. Sistema pode ficar lento por alguns minutos.',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          read: true,
          priority: 5
        }
      ]);

      setIsLoading(false);
    }, 1200);
  }, [timeRange]);

  // Sistema de notificações melhorado
  useEffect(() => {
    const urgentNotifications = notifications.filter(n => (n.type === 'error' || n.priority <= 2) && !n.read);
    if (urgentNotifications.length > 0 && !toastShown.current) {
      urgentNotifications.forEach(notification => {
        toast({
          title: notification.title,
          description: notification.message,
          duration: 8000,
          variant: notification.type === 'error' ? 'destructive' : 'default',
        });
      });
      toastShown.current = true;
    }
  }, [notifications, toast]);

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleRemoveNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getPriorityColor = (priority: TaskPriority) => {
    const colors = {
      baixa: "bg-gray-100 text-gray-800",
      media: "bg-blue-100 text-blue-800",
      alta: "bg-orange-100 text-orange-800",
      urgente: "bg-red-100 text-red-800"
    };
    return colors[priority];
  };

  const getStatusColor = (status: TaskStatus) => {
    const colors = {
      pendente: "bg-gray-100 text-gray-800",
      em_andamento: "bg-blue-100 text-blue-800",
      concluida: "bg-green-100 text-green-800",
      cancelada: "bg-red-100 text-red-800"
    };
    return colors[status];
  };

  const filteredTasks = taskFilter === 'all' ? tasks : tasks.filter(task => task.status === taskFilter);



  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Atualizado",
        description: "Dashboard atualizado com sucesso"
      });
    }, 1000);
  };

  const dashboardStats = [
    { label: "Receita Total", value: `R$ ${(stats?.totalRevenue || 0).toLocaleString('pt-BR')}`, variant: 'success' },
    { label: "Contratos Ativos", value: stats?.activeContracts || 0, variant: 'default' },
    { label: "Casos Ativos", value: stats?.activeCases || 0, variant: 'default' },
    { label: "Tarefas Urgentes", value: stats?.urgentTasks || 0, variant: stats?.urgentTasks && stats.urgentTasks > 0 ? 'warning' : 'default' }
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50 animate-fade-in">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          title="Dashboard Executivo" 
          subtitle="Central de controle e indicadores de performance do escritório jurídico"
          action={
            <div className="flex items-center space-x-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 dias</SelectItem>
                  <SelectItem value="30d">30 dias</SelectItem>
                  <SelectItem value="90d">90 dias</SelectItem>
                  <SelectItem value="1y">1 ano</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
            </div>
          }
        />

        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Page Header with Stats */}
            <PageHeader
              title="Dashboard Executivo"
              subtitle="Visão geral completa do escritório jurídico e indicadores de performance"
              stats={dashboardStats}
              onRefresh={handleRefresh}
              isLoading={isLoading}
            />

            {/* Loading */}
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
                  <p className="text-lg text-blue-600 font-medium">Carregando dados do dashboard...</p>
                  <p className="text-sm text-gray-500">Coletando informações de performance...</p>
                </div>
              </div>
            )}

            {/* Main Content */}
            {!isLoading && (
              <>
                {/* Enhanced Overview Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <Card className="legal-card hover:shadow-lg transition-all duration-200 group">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600">Receita Total</p>
                          <div className="flex items-center space-x-2">
                            <p className="text-2xl font-bold text-green-600">
                              R$ {stats?.totalRevenue.toLocaleString('pt-BR')}
                            </p>
                            <Badge className="bg-green-100 text-green-800">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              +{stats?.revenueGrowth}%
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs text-gray-600">
                              <span>Meta: R$ {stats?.monthlyGoal.toLocaleString('pt-BR')}</span>
                              <span>{Math.round((stats?.totalRevenue / stats?.monthlyGoal) * 100 || 0)}%</span>
                            </div>
                            <Progress value={(stats?.totalRevenue / stats?.monthlyGoal) * 100 || 0} className="h-2" />
                          </div>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                          <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="legal-card hover:shadow-lg transition-all duration-200 group">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600">Casos & Contratos</p>
                          <p className="text-2xl font-bold">{stats?.activeCases}</p>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-blue-100 text-blue-800">
                              {stats?.activeContracts} contratos
                            </Badge>
                            <Badge className="bg-purple-100 text-purple-800">
                              {stats?.scheduledHearings} audiências
                            </Badge>
                          </div>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                          <Scale className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="legal-card hover:shadow-lg transition-all duration-200 group">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600">Produtividade</p>
                          <p className="text-2xl font-bold">{stats?.teamProductivity}%</p>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs text-gray-600">
                              <span>Conclusão média</span>
                              <span>{stats?.averageTaskCompletion}%</span>
                            </div>
                            <Progress value={stats?.teamProductivity} className="h-2" />
                          </div>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
                          <Target className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="legal-card hover:shadow-lg transition-all duration-200 group">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600">Tarefas & Prazos</p>
                          <p className="text-2xl font-bold">{stats?.pendingTasks}</p>
                          <div className="flex items-center space-x-2">
                            {stats?.urgentTasks && stats.urgentTasks > 0 ? (
                              <Badge className="bg-red-100 text-red-800">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                {stats.urgentTasks} urgentes
                              </Badge>
                            ) : (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Em dia
                              </Badge>
                            )}
                            <Badge className="bg-gray-100 text-gray-800">
                              {stats?.upcomingDeadlines} prazos
                            </Badge>
                          </div>
                        </div>
                        <div className="p-3 bg-orange-100 rounded-full group-hover:bg-orange-200 transition-colors">
                          <Clock className="h-6 w-6 text-orange-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Enhanced Tabs Navigation */}
                <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
                  <TabsList className="grid w-full grid-cols-5 legal-card shadow-md h-12">
                    <TabsTrigger value="overview" className="flex items-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                      <Activity className="w-4 h-4" />
                      <span className="hidden sm:inline">Visão Geral</span>
                    </TabsTrigger>
                    <TabsTrigger value="tasks" className="flex items-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                      <CheckCircle className="w-4 h-4" />
                      <span className="hidden sm:inline">Tarefas</span>
                    </TabsTrigger>
                    <TabsTrigger value="calendar" className="flex items-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                      <CalendarIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">Calendário</span>
                    </TabsTrigger>
                    <TabsTrigger value="financeiro" className="flex items-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                      <BarChart3 className="w-4 h-4" />
                      <span className="hidden sm:inline">Financeiro</span>
                    </TabsTrigger>
                    <TabsTrigger value="atividades" className="flex items-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                      <Briefcase className="w-4 h-4" />
                      <span className="hidden sm:inline">Atividades</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Tab Contents */}
                  <TabsContent value="overview" className="space-y-6 mt-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                      <div className="space-y-6">
                        <RevenueChart />
                        <QuickActions />
                      </div>
                      <div className="space-y-6">
                        <UpcomingEvents />
                        <RecentActivities />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="tasks" className="mt-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">Gestão de Tarefas</h3>
                          <p className="text-sm text-gray-600">Acompanhe e gerencie todas as tarefas do escritório</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Select value={taskFilter} onValueChange={(value) => setTaskFilter(value as any)}>
                            <SelectTrigger className="w-40">
                              <Filter className="w-4 h-4 mr-2" />
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Todas</SelectItem>
                              <SelectItem value="pendente">Pendentes</SelectItem>
                              <SelectItem value="em_andamento">Em Andamento</SelectItem>
                              <SelectItem value="concluida">Concluídas</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button onClick={() => window.location.href = '/tasks'} className="legal-button-primary">
                            <Plus className="w-4 h-4 mr-2" />
                            Nova Tarefa
                          </Button>
                        </div>
                      </div>

                      <div className="grid gap-4">
                        {filteredTasks.map((task) => (
                          <Card key={task.id} className="legal-card hover:shadow-md transition-all duration-200">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 space-y-3">
                                  <div className="flex items-center space-x-2">
                                    <h4 className="font-semibold text-lg">{task.title}</h4>
                                    <Badge className={getPriorityColor(task.priority)}>
                                      {task.priority}
                                    </Badge>
                                    <Badge className={getStatusColor(task.status)}>
                                      {task.status.replace('_', ' ')}
                                    </Badge>
                                  </div>
                                  <p className="text-gray-600">{task.description}</p>

                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="space-y-1">
                                      <span className="font-medium text-gray-500">Vencimento:</span>
                                      <p className="font-medium">{task.dueDate.toLocaleDateString('pt-BR')}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <span className="font-medium text-gray-500">Responsável:</span>
                                      <p className="font-medium">{task.assignedTo}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <span className="font-medium text-gray-500">Categoria:</span>
                                      <p className="font-medium capitalize">{task.category}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <span className="font-medium text-gray-500">Horas:</span>
                                      <p className="font-medium">{task.actualHours}h / {task.estimatedHours}h</p>
                                    </div>
                                  </div>

                                  <div>
                                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                      <span className="font-medium">Progresso</span>
                                      <span className="font-medium">{task.progress}%</span>
                                    </div>
                                    <Progress value={task.progress} className="h-3" />
                                  </div>
                                </div>
                                <Button variant="ghost" size="sm" className="ml-4">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="calendar" className="mt-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                      <div className="lg:col-span-2">
                        <Calendar />
                      </div>
                      <div className="space-y-6">
                        <UpcomingEvents />
                        <Card className="legal-card shadow-lg">
                          <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                              <CalendarIcon className="w-5 h-5 text-blue-600" />
                              <span>Estatísticas do Mês</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                                <span className="text-sm font-medium text-red-700">Audiências</span>
                                <Badge className="bg-red-100 text-red-800">{stats?.scheduledHearings}</Badge>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                <span className="text-sm font-medium text-blue-700">Reuniões</span>
                                <Badge className="bg-blue-100 text-blue-800">15</Badge>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                                <span className="text-sm font-medium text-yellow-700">Prazos</span>
                                <Badge className="bg-yellow-100 text-yellow-800">{stats?.upcomingDeadlines}</Badge>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                <span className="text-sm font-medium text-green-700">Total de Compromissos</span>
                                <Badge className="bg-green-100 text-green-800">
                                  {(stats?.scheduledHearings || 0) + 15 + (stats?.upcomingDeadlines || 0)}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="financeiro" className="mt-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                      <div className="lg:col-span-2">
                        <RevenueChart />
                      </div>
                      <div className="space-y-6">
                        <Card className="legal-card shadow-lg">
                          <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                              <DollarSign className="w-5 h-5 text-green-600" />
                              <span>Resumo Financeiro</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                <span className="text-sm font-medium text-green-700">Receita Mensal</span>
                                <span className="font-bold text-green-600">
                                  R$ {stats?.totalRevenue ? (stats.totalRevenue / 1000).toFixed(0) : '0'}k
                                </span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                <span className="text-sm font-medium text-blue-700">Contratos Ativos</span>
                                <span className="font-bold text-blue-600">{stats?.activeContracts || 0}</span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                                <span className="text-sm font-medium text-purple-700">Novos Clientes</span>
                                <span className="font-bold text-purple-600">{stats?.newClientsThisMonth || 0}</span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                                <span className="text-sm font-medium text-orange-700">Crescimento</span>
                                <Badge className="bg-orange-100 text-orange-800">
                                  +{stats?.revenueGrowth || 0}%
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <QuickActions />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="atividades" className="mt-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                      <RecentActivities />
<div className="space-y-6">
                        <UpcomingEvents />
                        <Card className="legal-card shadow-lg">
                          <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                              <Activity className="w-5 h-5 text-purple-600" />
                              <span>Produtividade da Equipe</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                <span className="text-sm font-medium text-green-700">Tarefas Concluídas</span>
                                <Badge className="bg-green-100 text-green-800">{stats?.completedTasks}</Badge>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                <span className="text-sm font-medium text-blue-700">Em Andamento</span>
                                <Badge className="bg-blue-100 text-blue-800">
                                  {tasks.filter(t => t.status === 'em_andamento').length}
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                                <span className="text-sm font-medium text-yellow-700">Pendentes</span>
                                <Badge className="bg-yellow-100 text-yellow-800">
                                  {stats?.pendingTasks || 0}
                                </Badge>
                              </div>
                              <div className="p-3 bg-purple-50 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-medium text-purple-700">Taxa de Produtividade</span>
                                  <span className="font-bold text-purple-600">{stats?.teamProductivity}%</span>
                                </div>
                                <Progress value={stats?.teamProductivity} className="h-3" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                   {/* Alerts */}
        {notifications.map((alert) => (
          <div key={alert.id} className="rounded-md bg-gray-50 p-4">
            <div className="flex">
            <div className="flex-shrink-0">
                        {renderAlertIcon(alert.type)}
                        </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-800">{alert.title}</h3>
                <div className="mt-2 text-sm text-gray-700">
                  <p>{alert.message}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
                </Tabs>
              </>
            )}
          </div>
        </main>
      </div>


    </div>
  );
}