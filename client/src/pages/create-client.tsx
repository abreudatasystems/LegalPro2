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
import { ArrowLeft, Save, User } from "lucide-react";

type ClientType = 'individual' | 'company';
type ClientStatus = 'ativo' | 'inativo' | 'prospecto' | 'suspenso';

export default function CreateClient() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const [clientData, setClientData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'individual' as ClientType,
    status: 'prospecto' as ClientStatus,
    personalDocument: '',
    companyDocument: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    birthDate: '',
    profession: '',
    industry: '',
    contactPerson: '',
    website: '',
    referredBy: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientData.name || !clientData.email) {
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
        description: "Cliente criado com sucesso"
      });

      setLocation("/clients");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar cliente",
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
          title="Novo Cliente" 
          subtitle="Cadastrar novo cliente"
          action={
            <Button 
                variant="outline" 
                onClick={() => window.history.back()}
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
                  <User className="w-5 h-5 text-blue-600" />
                  <span>Dados do Cliente</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="basic">Dados Básicos</TabsTrigger>
                      <TabsTrigger value="contact">Contato</TabsTrigger>
                      <TabsTrigger value="additional">Informações Adicionais</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Nome / Razão Social</Label>
                          <Input
                            id="name"
                            value={clientData.name}
                            onChange={(e) => setClientData({...clientData, name: e.target.value})}
                            placeholder="Nome completo ou razão social"
                            required
                          />
                        </div>

                        <div>
                          <Label>Tipo</Label>
                          <Select 
                            value={clientData.type} 
                            onValueChange={(value) => setClientData({...clientData, type: value as ClientType})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="individual">Pessoa Física</SelectItem>
                              <SelectItem value="company">Pessoa Jurídica</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Status</Label>
                          <Select 
                            value={clientData.status} 
                            onValueChange={(value) => setClientData({...clientData, status: value as ClientStatus})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="prospecto">Prospecto</SelectItem>
                              <SelectItem value="ativo">Ativo</SelectItem>
                              <SelectItem value="inativo">Inativo</SelectItem>
                              <SelectItem value="suspenso">Suspenso</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {clientData.type === 'individual' ? (
                          <>
                            <div>
                              <Label htmlFor="personalDocument">CPF</Label>
                              <Input
                                id="personalDocument"
                                value={clientData.personalDocument}
                                onChange={(e) => setClientData({...clientData, personalDocument: e.target.value})}
                                placeholder="000.000.000-00"
                              />
                            </div>
                            <div>
                              <Label htmlFor="birthDate">Data de Nascimento</Label>
                              <Input
                                id="birthDate"
                                type="date"
                                value={clientData.birthDate}
                                onChange={(e) => setClientData({...clientData, birthDate: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="profession">Profissão</Label>
                              <Input
                                id="profession"
                                value={clientData.profession}
                                onChange={(e) => setClientData({...clientData, profession: e.target.value})}
                                placeholder="Profissão"
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <Label htmlFor="companyDocument">CNPJ</Label>
                              <Input
                                id="companyDocument"
                                value={clientData.companyDocument}
                                onChange={(e) => setClientData({...clientData, companyDocument: e.target.value})}
                                placeholder="00.000.000/0001-00"
                              />
                            </div>
                            <div>
                              <Label htmlFor="industry">Setor/Ramo</Label>
                              <Input
                                id="industry"
                                value={clientData.industry}
                                onChange={(e) => setClientData({...clientData, industry: e.target.value})}
                                placeholder="Setor de atuação"
                              />
                            </div>
                            <div>
                              <Label htmlFor="contactPerson">Pessoa de Contato</Label>
                              <Input
                                id="contactPerson"
                                value={clientData.contactPerson}
                                onChange={(e) => setClientData({...clientData, contactPerson: e.target.value})}
                                placeholder="Nome do responsável"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="contact" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={clientData.email}
                            onChange={(e) => setClientData({...clientData, email: e.target.value})}
                            placeholder="email@exemplo.com"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="phone">Telefone</Label>
                          <Input
                            id="phone"
                            value={clientData.phone}
                            onChange={(e) => setClientData({...clientData, phone: e.target.value})}
                            placeholder="(11) 99999-8888"
                          />
                        </div>

                        <div>
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            value={clientData.website}
                            onChange={(e) => setClientData({...clientData, website: e.target.value})}
                            placeholder="www.exemplo.com"
                          />
                        </div>

                        <div>
                          <Label htmlFor="zipCode">CEP</Label>
                          <Input
                            id="zipCode"
                            value={clientData.zipCode}
                            onChange={(e) => setClientData({...clientData, zipCode: e.target.value})}
                            placeholder="00000-000"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <Label htmlFor="address">Endereço</Label>
                          <Input
                            id="address"
                            value={clientData.address}
                            onChange={(e) => setClientData({...clientData, address: e.target.value})}
                            placeholder="Rua, número, complemento"
                          />
                        </div>

                        <div>
                          <Label htmlFor="city">Cidade</Label>
                          <Input
                            id="city"
                            value={clientData.city}
                            onChange={(e) => setClientData({...clientData, city: e.target.value})}
                            placeholder="Cidade"
                          />
                        </div>

                        <div>
                          <Label htmlFor="state">Estado</Label>
                          <Input
                            id="state"
                            value={clientData.state}
                            onChange={(e) => setClientData({...clientData, state: e.target.value})}
                            placeholder="UF"
                            maxLength={2}
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="additional" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="referredBy">Indicado por</Label>
                          <Input
                            id="referredBy"
                            value={clientData.referredBy}
                            onChange={(e) => setClientData({...clientData, referredBy: e.target.value})}
                            placeholder="Nome de quem indicou"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="notes">Observações</Label>
                        <Textarea
                          id="notes"
                          value={clientData.notes}
                          onChange={(e) => setClientData({...clientData, notes: e.target.value})}
                          placeholder="Informações adicionais sobre o cliente"
                          rows={4}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => window.history.back()}
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
                          Criar Cliente
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