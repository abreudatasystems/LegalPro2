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
import { ArrowLeft, Save, Building2 } from "lucide-react";

type SupplierType = 'servicos' | 'produtos' | 'tecnologia' | 'consultoria' | 'manutencao' | 'outros';
type SupplierStatus = 'ativo' | 'inativo' | 'pendente' | 'bloqueado';

export default function CreateSupplier() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const [supplierData, setSupplierData] = useState({
    name: '',
    email: '',
    phone: '',
    document: '',
    type: 'servicos' as SupplierType,
    status: 'ativo' as SupplierStatus,
    address: '',
    city: '',
    state: '',
    zipCode: '',
    website: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    category: '',
    rating: 5,
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supplierData.name || !supplierData.email) {
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
        description: "Fornecedor criado com sucesso"
      });

      setLocation("/suppliers");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar fornecedor",
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
          title="Novo Fornecedor" 
          subtitle="Cadastrar novo fornecedor"
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
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <span>Dados do Fornecedor</span>
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
                          <Label htmlFor="name">Nome da Empresa</Label>
                          <Input
                            id="name"
                            value={supplierData.name}
                            onChange={(e) => setSupplierData({...supplierData, name: e.target.value})}
                            placeholder="Nome do fornecedor"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="document">CNPJ</Label>
                          <Input
                            id="document"
                            value={supplierData.document}
                            onChange={(e) => setSupplierData({...supplierData, document: e.target.value})}
                            placeholder="00.000.000/0001-00"
                          />
                        </div>

                        <div>
                          <Label>Tipo</Label>
                          <Select 
                            value={supplierData.type} 
                            onValueChange={(value) => setSupplierData({...supplierData, type: value as SupplierType})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="servicos">Serviços</SelectItem>
                              <SelectItem value="produtos">Produtos</SelectItem>
                              <SelectItem value="tecnologia">Tecnologia</SelectItem>
                              <SelectItem value="consultoria">Consultoria</SelectItem>
                              <SelectItem value="manutencao">Manutenção</SelectItem>
                              <SelectItem value="outros">Outros</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Status</Label>
                          <Select 
                            value={supplierData.status} 
                            onValueChange={(value) => setSupplierData({...supplierData, status: value as SupplierStatus})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ativo">Ativo</SelectItem>
                              <SelectItem value="inativo">Inativo</SelectItem>
                              <SelectItem value="pendente">Pendente</SelectItem>
                              <SelectItem value="bloqueado">Bloqueado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="category">Categoria</Label>
                          <Input
                            id="category"
                            value={supplierData.category}
                            onChange={(e) => setSupplierData({...supplierData, category: e.target.value})}
                            placeholder="Categoria do fornecedor"
                          />
                        </div>

                        <div>
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            value={supplierData.website}
                            onChange={(e) => setSupplierData({...supplierData, website: e.target.value})}
                            placeholder="www.fornecedor.com.br"
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
                            value={supplierData.email}
                            onChange={(e) => setSupplierData({...supplierData, email: e.target.value})}
                            placeholder="contato@fornecedor.com.br"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="phone">Telefone</Label>
                          <Input
                            id="phone"
                            value={supplierData.phone}
                            onChange={(e) => setSupplierData({...supplierData, phone: e.target.value})}
                            placeholder="(11) 1234-5678"
                          />
                        </div>

                        <div>
                          <Label htmlFor="contactPerson">Pessoa de Contato</Label>
                          <Input
                            id="contactPerson"
                            value={supplierData.contactPerson}
                            onChange={(e) => setSupplierData({...supplierData, contactPerson: e.target.value})}
                            placeholder="Nome do responsável"
                          />
                        </div>

                        <div>
                          <Label htmlFor="contactPhone">Telefone do Contato</Label>
                          <Input
                            id="contactPhone"
                            value={supplierData.contactPhone}
                            onChange={(e) => setSupplierData({...supplierData, contactPhone: e.target.value})}
                            placeholder="(11) 99999-8888"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <Label htmlFor="contactEmail">Email do Contato</Label>
                          <Input
                            id="contactEmail"
                            type="email"
                            value={supplierData.contactEmail}
                            onChange={(e) => setSupplierData({...supplierData, contactEmail: e.target.value})}
                            placeholder="contato@fornecedor.com.br"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <Label htmlFor="address">Endereço</Label>
                          <Input
                            id="address"
                            value={supplierData.address}
                            onChange={(e) => setSupplierData({...supplierData, address: e.target.value})}
                            placeholder="Rua, número, complemento"
                          />
                        </div>

                        <div>
                          <Label htmlFor="city">Cidade</Label>
                          <Input
                            id="city"
                            value={supplierData.city}
                            onChange={(e) => setSupplierData({...supplierData, city: e.target.value})}
                            placeholder="Cidade"
                          />
                        </div>

                        <div>
                          <Label htmlFor="state">Estado</Label>
                          <Input
                            id="state"
                            value={supplierData.state}
                            onChange={(e) => setSupplierData({...supplierData, state: e.target.value})}
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
                          value={supplierData.notes}
                          onChange={(e) => setSupplierData({...supplierData, notes: e.target.value})}
                          placeholder="Informações adicionais sobre o fornecedor"
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
                          Criar Fornecedor
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