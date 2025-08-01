
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
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/ui/page-header";
import {
  Plus,
  Filter,
  Search,
  Clock,
  CheckCircle,
  AlertTriangle,
  Edit,
  Trash2,
  MoreHorizontal,
  Calendar,
  User,
  Target
} from "lucide-react";

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

export default function Tasks() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | TaskStatus>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | TaskPriority>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newTask, setNewTask] = useState<Partial<Task>>({
    priority: 'media',
    status: 'pendente',
    category: 'legal',
    progress: 0,
    estimatedHours: 1
  });

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
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
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

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

  const getStatusIcon = (status: TaskStatus) => {
    const icons = {
      pendente: Clock,
      em_andamento: Target,
      concluida: CheckCircle,
      cancelada: AlertTriangle
    };
    return icons[status];
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTask.title || !newTask.dueDate) {
      toast({
        title: "Erro",
        description: "Título e data de vencimento são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title!,
      description: newTask.description || '',
      priority: newTask.priority as TaskPriority,
      status: newTask.status as TaskStatus,
      dueDate: newTask.dueDate!,
      assignedTo: newTask.assignedTo || 'Não atribuído',
      category: newTask.category as Task['category'],
      progress: newTask.progress || 0,
      estimatedHours: newTask.estimatedHours || 1,
      actualHours: 0
    };

    setTasks([task, ...tasks]);
    setNewTask({
      priority: 'media',
      status: 'pendente',
      category: 'legal',
      progress: 0,
      estimatedHours: 1
    });
    setShowCreateForm(false);

    toast({
      title: "Sucesso",
      description: "Tarefa criada com sucesso"
    });
  };

  const taskStats = [
    { label: "Total de Tarefas", value: tasks.length, variant: 'default' },
    { label: "Pendentes", value: tasks.filter(t => t.status === 'pendente').length, variant: 'warning' },
    { label: "Em Andamento", value: tasks.filter(t => t.status === 'em_andamento').length, variant: 'default' },
    { label: "Concluídas", value: tasks.filter(t => t.status === 'concluida').length, variant: 'success' }
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          title="Gestão de Tarefas" 
          subtitle="Gerencie e acompanhe todas as tarefas do escritório"
          action={
            <Button onClick={() => setShowCreateForm(!showCreateForm)} className="legal-button-primary">
              <Plus className="w-4 h-4 mr-2" />
              Nova Tarefa
            </Button>
          }
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <PageHeader
              title="Gestão de Tarefas"
              subtitle="Central de controle de tarefas e atividades do escritório"
              stats={taskStats}
            />

            {/* Search and Filters */}
            <Card className="legal-card">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar tarefas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Status</SelectItem>
                      <SelectItem value="pendente">Pendentes</SelectItem>
                      <SelectItem value="em_andamento">Em Andamento</SelectItem>
                      <SelectItem value="concluida">Concluídas</SelectItem>
                      <SelectItem value="cancelada">Canceladas</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterPriority} onValueChange={(value) => setFilterPriority(value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as Prioridades</SelectItem>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" className="w-full">
                    <Filter className="w-4 h-4 mr-2" />
                    Limpar Filtros
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Create Task Form */}
            {showCreateForm && (
              <Card className="legal-card border-blue-200 shadow-lg">
                <CardHeader>
                  <CardTitle>Criar Nova Tarefa</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateTask} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="task-title">Título da Tarefa</Label>
                        <Input
                          id="task-title"
                          value={newTask.title || ''}
                          onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                          placeholder="Título da tarefa"
                          required
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <Label htmlFor="task-description">Descrição</Label>
                        <Textarea
                          id="task-description"
                          value={newTask.description || ''}
                          onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                          placeholder="Descrição detalhada da tarefa"
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label>Prioridade</Label>
                        <Select value={newTask.priority} onValueChange={(value) => setNewTask({...newTask, priority: value as TaskPriority})}>
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
                        <Label>Categoria</Label>
                        <Select value={newTask.category} onValueChange={(value) => setNewTask({...newTask, category: value as Task['category']})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="legal">Legal</SelectItem>
                            <SelectItem value="administrativa">Administrativa</SelectItem>
                            <SelectItem value="comercial">Comercial</SelectItem>
                            <SelectItem value="financeira">Financeira</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="task-due-date">Data de Vencimento</Label>
                        <Input
                          id="task-due-date"
                          type="datetime-local"
                          value={newTask.dueDate ? newTask.dueDate.toISOString().slice(0, 16) : ''}
                          onChange={(e) => setNewTask({...newTask, dueDate: new Date(e.target.value)})}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="task-assigned">Responsável</Label>
                        <Input
                          id="task-assigned"
                          value={newTask.assignedTo || ''}
                          onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                          placeholder="Nome do responsável"
                        />
                      </div>

                      <div>
                        <Label htmlFor="task-hours">Horas Estimadas</Label>
                        <Input
                          id="task-hours"
                          type="number"
                          min="0.5"
                          step="0.5"
                          value={newTask.estimatedHours || ''}
                          onChange={(e) => setNewTask({...newTask, estimatedHours: parseFloat(e.target.value)})}
                          placeholder="Horas estimadas"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowCreateForm(false)}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="legal-button-primary">
                        Criar Tarefa
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Tasks List */}
            <div className="grid gap-4">
              {isLoading ? (
                <div className="grid gap-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-2 bg-gray-200 rounded w-full"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredTasks.length === 0 ? (
                <Card className="legal-card">
                  <CardContent className="p-8 text-center">
                    <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {searchTerm ? "Nenhuma tarefa encontrada" : "Nenhuma tarefa cadastrada"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredTasks.map((task) => {
                  const StatusIcon = getStatusIcon(task.status);
                  return (
                    <Card key={task.id} className="legal-card hover:shadow-lg transition-all duration-200">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center space-x-3">
                              <StatusIcon className="w-5 h-5 text-gray-600" />
                              <h4 className="font-semibold text-lg">{task.title}</h4>
                              <Badge className={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                              <Badge className={getStatusColor(task.status)}>
                                {task.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            
                            <p className="text-gray-600">{task.description}</p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span>{task.dueDate.toLocaleDateString('pt-BR')}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <User className="w-4 h-4 text-gray-500" />
                                <span>{task.assignedTo}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Target className="w-4 h-4 text-gray-500" />
                                <span className="capitalize">{task.category}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <span>{task.actualHours}h / {task.estimatedHours}h</span>
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
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
