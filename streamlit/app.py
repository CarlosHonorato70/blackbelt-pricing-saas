import streamlit as st
import requests
import pandas as pd
from datetime import datetime

# Page configuration
st.set_page_config(
    page_title="Black Belt Pricing SaaS",
    page_icon="🥋",
    layout="wide"
)

# Backend API URL
BACKEND_URL = "http://localhost:3001"

def main():
    """Main application function"""
    
    st.title("🥋 Black Belt Pricing SaaS")
    st.markdown("### Sistema de Precificação e Propostas Comerciais")
    
    # Sidebar navigation
    st.sidebar.title("Navegação")
    page = st.sidebar.radio(
        "Selecione uma página",
        ["Dashboard", "Cálculo de Hora Técnica", "Propostas", "Avaliações de Risco"]
    )
    
    if page == "Dashboard":
        show_dashboard()
    elif page == "Cálculo de Hora Técnica":
        show_technical_hour_calculator()
    elif page == "Propostas":
        show_proposals()
    elif page == "Avaliações de Risco":
        show_risk_assessments()

def show_dashboard():
    """Display dashboard with overview"""
    st.header("Dashboard")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.metric("Total de Propostas", "0", "0")
    
    with col2:
        st.metric("Clientes Ativos", "0", "0")
    
    with col3:
        st.metric("Valor Total", "R$ 0,00", "0%")
    
    st.info("📊 Conecte-se ao backend para visualizar dados em tempo real")

def show_technical_hour_calculator():
    """Display technical hour calculator"""
    st.header("Cálculo de Hora Técnica")
    
    with st.form("technical_hour_form"):
        st.subheader("Parâmetros de Precificação")
        
        col1, col2 = st.columns(2)
        
        with col1:
            fixed_costs = st.number_input(
                "Custos Fixos Mensais (R$)",
                min_value=0.0,
                value=5000.0,
                step=100.0
            )
            
            pro_labor = st.number_input(
                "Pró-labore Desejado (R$)",
                min_value=0.0,
                value=8000.0,
                step=100.0
            )
        
        with col2:
            productive_hours = st.number_input(
                "Horas Produtivas por Mês",
                min_value=1,
                value=160,
                step=1
            )
            
            tax_regime = st.selectbox(
                "Regime Tributário",
                ["MEI", "Simples Nacional", "Lucro Presumido", "Autônomo"]
            )
        
        calculate_btn = st.form_submit_button("Calcular Hora Técnica")
        
        if calculate_btn:
            # Simple calculation (would call backend in production)
            base_hour = (fixed_costs + pro_labor) / productive_hours
            
            # Apply tax rates (simplified)
            tax_rates = {
                "MEI": 0.08,
                "Simples Nacional": 0.15,
                "Lucro Presumido": 0.25,
                "Autônomo": 0.20
            }
            
            tax_rate = tax_rates.get(tax_regime, 0)
            final_hour = base_hour * (1 + tax_rate)
            
            st.success(f"✅ Hora Técnica Calculada: R$ {final_hour:.2f}")
            
            st.info(f"""
            **Detalhamento:**
            - Hora Base: R$ {base_hour:.2f}
            - Taxa Tributária ({tax_regime}): {tax_rate * 100:.0f}%
            - Hora Técnica Final: R$ {final_hour:.2f}
            """)

def show_proposals():
    """Display proposals list"""
    st.header("Propostas Comerciais")
    
    tab1, tab2 = st.tabs(["Lista de Propostas", "Nova Proposta"])
    
    with tab1:
        st.info("🔍 Nenhuma proposta encontrada. Conecte-se ao backend para visualizar dados.")
        
        # Sample data
        df = pd.DataFrame({
            "ID": [],
            "Cliente": [],
            "Título": [],
            "Status": [],
            "Valor Total": [],
            "Data": []
        })
        
        st.dataframe(df, use_container_width=True)
    
    with tab2:
        with st.form("new_proposal_form"):
            st.subheader("Criar Nova Proposta")
            
            client_name = st.text_input("Nome do Cliente")
            proposal_title = st.text_input("Título da Proposta")
            description = st.text_area("Descrição")
            
            col1, col2 = st.columns(2)
            
            with col1:
                discount = st.number_input(
                    "Desconto Geral (%)",
                    min_value=0.0,
                    max_value=100.0,
                    value=0.0,
                    step=0.5
                )
            
            with col2:
                displacement_fee = st.number_input(
                    "Taxa de Deslocamento (R$)",
                    min_value=0.0,
                    value=0.0,
                    step=10.0
                )
            
            submit_btn = st.form_submit_button("Criar Proposta")
            
            if submit_btn:
                if client_name and proposal_title:
                    st.success("✅ Proposta criada com sucesso!")
                else:
                    st.error("❌ Preencha todos os campos obrigatórios")

def show_risk_assessments():
    """Display risk assessments"""
    st.header("Avaliações de Risco (NR-01)")
    
    st.markdown("""
    **Avaliação de Riscos Psicossociais**
    
    Sistema para avaliação e gerenciamento de riscos ocupacionais conforme NR-01.
    """)
    
    with st.form("risk_assessment_form"):
        st.subheader("Nova Avaliação de Risco")
        
        client = st.text_input("Cliente")
        sector = st.text_input("Setor/Área")
        
        risk_level = st.select_slider(
            "Nível de Risco",
            options=["Baixo", "Médio", "Alto", "Muito Alto"]
        )
        
        psychosocial_factors = st.text_area(
            "Fatores Psicossociais Identificados",
            height=100
        )
        
        recommendations = st.text_area(
            "Recomendações",
            height=100
        )
        
        submit_btn = st.form_submit_button("Salvar Avaliação")
        
        if submit_btn:
            if client and sector:
                st.success("✅ Avaliação de risco salva com sucesso!")
                
                # Display risk level indicator
                risk_colors = {
                    "Baixo": "🟢",
                    "Médio": "🟡",
                    "Alto": "🟠",
                    "Muito Alto": "🔴"
                }
                
                st.info(f"{risk_colors[risk_level]} Nível de Risco: **{risk_level}**")
            else:
                st.error("❌ Preencha todos os campos obrigatórios")

if __name__ == "__main__":
    main()
