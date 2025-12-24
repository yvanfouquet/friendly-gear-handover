import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import EquipmentPage from "./pages/EquipmentPage";
import HandoverPage from "./pages/HandoverPage";
import CompaniesPage from "./pages/CompaniesPage";
import UsersPage from "./pages/UsersPage";
import ExportsPage from "./pages/ExportsPage";
import NewCollaboratorPage from "./pages/NewCollaboratorPage";
import SupportValidationPage from "./pages/SupportValidationPage";
import DeparturePage from "./pages/DeparturePage";
import HandoverSignaturePage from "./pages/HandoverSignaturePage";
import CollaboratorEquipmentPage from "./pages/CollaboratorEquipmentPage";
import MaintenancePage from "./pages/MaintenancePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/equipment" element={<EquipmentPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/handover" element={<HandoverPage />} />
          <Route path="/collaborateurs-equipes" element={<CollaboratorEquipmentPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/exports" element={<ExportsPage />} />
          <Route path="/nouveaucollaborateur" element={<NewCollaboratorPage />} />
          <Route path="/support" element={<SupportValidationPage />} />
          <Route path="/depart" element={<DeparturePage />} />
          <Route path="/signature" element={<HandoverSignaturePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
