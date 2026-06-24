import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Toaster, toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { clientSchema, ClientInput, ColorOutput } from '../../packages/shared';

const API_URL = '/api';

function App() {
  const [colors, setColors] = useState<ColorOutput[]>([]);
  const [isLoadingColors, setIsLoadingColors] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ClientInput>({
    resolver: zodResolver(clientSchema),
  });

  useEffect(() => {
    async function fetchColors() {
      try {
        const response = await axios.get(`${API_URL}/colors`);
        setColors(response.data);
      } catch (error) {
        toast.error('Erro ao carregar as cores do arco-íris.');
      } finally {
        setIsLoadingColors(false);
      }
    }
    fetchColors();
  }, []);

  const onSubmit = async (data: ClientInput) => {
    try {
      await axios.post(`${API_URL}/clients`, data);
      setIsSuccess(true);
      toast.success('Cadastro realizado com sucesso!');
      reset();
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Ocorreu um erro inesperado. Tente novamente.');
      }
    }
  };

  if (isSuccess) {
    return (
      <div className="container success-container">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          className="success-card"
        >
          <CheckCircle size={64} className="success-icon" />
          <h2>Tudo certo!</h2>
          <p>Seu cadastro foi concluído com sucesso. Obrigado por se juntar a nós.</p>
          <button onClick={() => setIsSuccess(false)} className="btn-primary mt-4">
            Voltar
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container">
      <Toaster position="top-right" />
      
      <div className="grid-layout">
        {/* Hero Section */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          className="hero-section"
        >
          <h1 className="hero-title">Acesso VIP <br/><span className="text-gradient">Eteg</span></h1>
          <p className="hero-subtitle">
            Faça parte da nossa lista exclusiva e tenha acesso a benefícios únicos.
            Preencha o formulário e garanta o seu lugar.
          </p>
          <div className="hero-features">
            <div className="feature-item">✨ Acesso antecipado</div>
            <div className="feature-item">🌈 Cores personalizadas</div>
            <div className="feature-item">🔒 Dados seguros</div>
          </div>
        </motion.div>

        {/* Form Section */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          className="form-wrapper"
        >
          <div className="glass-card">
            <h2>Crie sua conta</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="custom-form">
              <div className="input-group">
                <label>Nome Completo</label>
                <input 
                  type="text" 
                  placeholder="Seu nome"
                  className={errors.fullName ? 'error' : ''} 
                  {...register('fullName')} 
                />
                {errors.fullName && <span className="error-message">{errors.fullName.message}</span>}
              </div>

              <div className="input-group">
                <label>CPF</label>
                <input 
                  type="text" 
                  placeholder="Somente números"
                  maxLength={11}
                  className={errors.cpf ? 'error' : ''} 
                  {...register('cpf')} 
                />
                {errors.cpf && <span className="error-message">{errors.cpf.message}</span>}
              </div>

              <div className="input-group">
                <label>E-mail</label>
                <input 
                  type="email" 
                  placeholder="voce@exemplo.com"
                  className={errors.email ? 'error' : ''} 
                  {...register('email')} 
                />
                {errors.email && <span className="error-message">{errors.email.message}</span>}
              </div>

              <div className="input-group">
                <label>Cor Preferida</label>
                <div className="select-wrapper">
                  <select 
                    className={errors.colorId ? 'error' : ''} 
                    {...register('colorId')}
                    disabled={isLoadingColors}
                  >
                    <option value="">Selecione uma cor do arco-íris...</option>
                    {colors.map(color => (
                      <option key={color.id} value={color.id}>
                        {color.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.colorId && <span className="error-message">{errors.colorId.message}</span>}
              </div>

              <div className="input-group">
                <label>Observações (Opcional)</label>
                <textarea 
                  placeholder="Conte-nos algo..."
                  rows={3}
                  {...register('observations')} 
                />
              </div>

              <button type="submit" disabled={isSubmitting} className="btn-primary submit-btn">
                {isSubmitting ? (
                  <>
                    <Loader2 className="spinner" size={20} /> Processando...
                  </>
                ) : (
                  'Confirmar Cadastro'
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;
