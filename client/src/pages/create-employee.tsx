import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Users } from "lucide-react";

type EmployeeRole = 'socio' | 'advogado_senior' | 'advogado_junior' | 'estagiario' | 'secretaria' | 'administrativo' | 'outros';
type EmployeeStatus = 'ativo' | 'inativo' | 'ferias' | 'afastado' | 'demitido';

export default function CreateEmployee() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const [employeeData, setEmployeeData] = useState({
    name: '',
    email: '',
    phone: '',
    document: '',
    oab: '',
    role: 'advogado_junior' as EmployeeRole,
    status: 'ativo' as EmployeeStatus,
    department: '',
    salary: 0,
    hireDate: '',
    birthDate: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    emergencyContact: '',
    emergencyPhone: '',
    education: '',
    performanceRating: 5,
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!employeeData.name || !employeeData.email) {
      toast({
        title: "Erro",
        description: "Nome e email são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Sucesso",
        description: "Funcionário criado com sucesso"
      });

      setLocation("/employees");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar funcionário",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          title="Novo Funcionário" 
          subtitle="Cadastrar novo funcionário"
          action={
            <Button 
                variant="outline" 
                onClick={() => window.location.href = '/employees'}
                className="mr-3"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
          }
        />

        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="p-6 max-w-4xl mx-auto">
            <Card className="legal-card shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>Dados do Funcionário</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Tabs defaultValue="personal" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="personal">Pessoal</TabsTrigger>
                      <TabsTrigger value="professional">Profissional</TabsTrigger>
                      <TabsTrigger value="contact">Contato</TabsTrigger>
                      <TabsTrigger value="additional">Adicional</TabsTrigger>
                    </TabsList>

                    <TabsContent value="personal" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Nome Completo</Label>
                          <Input
                            id="name"
                            value={employeeData.name}
                            onChange={(e) => setEmployeeData({...employeeData, name: e.target.value})}
                            placeholder="Nome completo"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="document">CPF</Label>
                          <Input
                            id="document"
                            value={employeeData.document}
                            onChange={(e) => setEmployeeData({...employeeData, document: e.target.value})}
                            placeholder="000.000.000-00"
                          />
                        </div>

                        <div>
                          <Label htmlFor="birthDate">Data de Nascimento</Label>
                          <Input
                            id="birthDate"
                            type="date"
                            value={employeeData.birthDate}
                            onChange={(e) => setEmployeeData({...employeeData, birthDate: e.target.value})}
                          />
                        </div>

                        <div>
                          <Label htmlFor="education">Formação</Label>
                          <Input
                            id="education"
                            value={employeeData.education}
                            onChange={(e) => setEmployeeData({...employeeData, education: e.target.value})}
                            placeholder="Formação acadêmica"
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="professional" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Cargo</Label>
                          <Select 
                            value={employeeData.role} 
                            onValueChange={(value) => setEmployeeData({...employeeData, role: value as EmployeeRole})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="socio">Sócio</SelectItem>
                              <SelectItem value="advogado_senior">Advogado Sênior</SelectItem>
                              <SelectItem value="advogado_junior">Advogado Júnior</SelectItem>
                              <SelectItem value="estagiario">Estagiário</SelectItem>
                              <SelectItem value="secretaria">Secretária</SelectItem>
                              <SelectItem value="administrativo">Administrativo</SelectItem>
                              <SelectItem value="outros">Outros</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Status</Label>
                          <Select 
                            value={employeeData.status} 
                            onValueChange={(value) => setEmployeeData({...employeeData, status: value as EmployeeStatus})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ativo">Ativo</SelectItem>
                              <SelectItem value="inativo">Inativo</SelectItem>
                              <SelectItem value="ferias">Férias</SelectItem>
                              <SelectItem value="afastado">Afastado</SelectItem>
                              <SelectItem value="demitido">Demitido</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="oab">OAB (se aplicável)</Label>
                          <Input
                            id="oab"
                            value={employeeData.oab}
                            onChange={(e) => setEmployeeData({...employeeData, oab: e.target.value})}
                            placeholder="OAB/UF 123456"
                          />
                        </div>

                        <div>
                          <Label htmlFor="department">Departamento</Label>
                          <Input
                            id="department"
                            value={employeeData.department}
                            onChange={(e) => setEmployeeData({...employeeData, department: e.target.value})}
                            placeholder="Departamento"
                          />
                        </div>

                        <div>
                          <Label htmlFor="salary">Salário</Label>
                          <Input
                            id="salary"
                            type="number"
                            step="0.01"
                            value={employeeData.salary}
                            onChange={(e) => setEmployeeData({...employeeData, salary: parseFloat(e.target.value) || 0})}
                            placeholder="0.00"
                          />
                        </div>

                        <div>
                          <Label htmlFor="hireDate">Data de Contratação</Label>
                          <Input
                            id="hireDate"
                            type="date"
                            value={employeeData.hireDate}
                            onChange={(e) => setEmployeeData({...employeeData, hireDate: e.target.value})}
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="contact" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={employeeData.email}
                            onChange={(e) => setEmployeeData({...employeeData, email: e.target.value})}
                            placeholder="email@escritorio.com.br"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="phone">Telefone</Label>
                          <Input
                            id="phone"
                            value={employeeData.phone}
                            onChange={(e) => setEmployeeData({...employeeData, phone: e.target.value})}
                            placeholder="(11) 99999-8888"
                          />
                        </div>

                        <div>
                          <Label htmlFor="emergencyContact">Contato de Emergência</Label>
                          <Input
                            id="emergencyContact"
                            value={employeeData.emergencyContact}
                            onChange={(e) => setEmployeeData({...employeeData, emergencyContact: e.target.value})}
                            placeholder="Nome do contato"
                          />
                        </div>

                        <div>
                          <Label htmlFor="emergencyPhone">Telefone de Emergência</Label>
                          <Input
                            id="emergencyPhone"
                            value={employeeData.emergencyPhone}
                            onChange={(e) => setEmployeeData({...employeeData, emergencyPhone: e.target.value})}
                            placeholder="(11) 88888-7777"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <Label htmlFor="address">Endereço</Label>
                          <Input
                            id="address"
                            value={employeeData.address}
                            onChange={(e) => setEmployeeData({...employeeData, address: e.target.value})}
                            placeholder="Rua, número, complemento"
                          />
                        </div>

                        <div>
                          <Label htmlFor="city">Cidade</Label>
                          <Input
                            id="city"
                            value={employeeData.city}
                            onChange={(e) => setEmployeeData({...employeeData, city: e.target.value})}
                            placeholder="Cidade"
                          />
                        </div>

                        <div>
                          <Label htmlFor="state">Estado</Label>
                          <Input
                            id="state"
                            value={employeeData.state}
                            onChange={(e) => setEmployeeData({...employeeData, state: e.target.value})}
                            placeholder="UF"
                            maxLength={2}
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="additional" className="space-y-4">
                      <div>
                        <Label htmlFor="notes">Observações</Label>
                        <Textarea
                          id="notes"
                          value={employeeData.notes}
                          onChange={(e) => setEmployeeData({...employeeData, notes: e.target.value})}
                          placeholder="Informações adicionais sobre o funcionário"
                          rows={4}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => window.location.href = '/employees'}
                      disabled={isLoading}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      className="legal-button-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>Salvando...</>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Criar Funcionário
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}