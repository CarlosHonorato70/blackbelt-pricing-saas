import React from 'react';

/**
 * Main App component for Black Belt Pricing SaaS Frontend
 */
function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1>Black Belt Pricing SaaS</h1>
        <p style={{ color: '#666' }}>Sistema de Precificação e Propostas Comerciais</p>
      </header>

      <main>
        <section style={{ marginBottom: '2rem' }}>
          <h2>Bem-vindo</h2>
          <p>
            Esta é a aplicação frontend do Black Belt Pricing SaaS. 
            O sistema oferece funcionalidades para:
          </p>
          <ul>
            <li>Cálculo automático de Hora Técnica</li>
            <li>Gerenciamento de clientes e serviços</li>
            <li>Criação de propostas comerciais</li>
            <li>Avaliações de risco (NR-01)</li>
            <li>Ajustes de personalização, risco e senioridade</li>
          </ul>
        </section>

        <section>
          <h3>Status do Sistema</h3>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#f0f0f0', 
            borderRadius: '4px',
            marginTop: '1rem'
          }}>
            <p>✅ Frontend inicializado</p>
            <p>⚙️ Configure o backend para começar</p>
          </div>
        </section>
      </main>

      <footer style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #ddd' }}>
        <p style={{ color: '#999', fontSize: '0.9rem' }}>
          © {new Date().getFullYear()} Black Belt Consultoria
        </p>
      </footer>
    </div>
  );
}

export default App;
