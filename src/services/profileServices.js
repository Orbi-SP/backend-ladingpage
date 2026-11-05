import { supabase } from "../config/supabaseClient.js";
import bcrypt from "bcryptjs";

class ProfileService {
  // --- AUTENTICAÇÃO E USUÁRIOS ---
  
  async create(username, email, password) {
    const { data, error } = await supabase
      .from("profiles")
      .insert([{ username, email, password }])
      .select();

    if (error) throw error;
    return data[0];
  }

  async login(email, password) {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !profile) return null;

    const isMatch = await bcrypt.compare(password, profile.password);
    if (!isMatch) return null;

    return profile;
  }

  // --- RUNS E SCORES ---

  // Criar uma nova Run e seus respectivos Scores
  async createRun(runData, scoresData) {
    // 1. Inserir a Run
    const { data: newRun, error: runError } = await supabase
      .from("runs")
      .insert([{
        user_id: runData.user_id,
        started_at: runData.started_at,
        finished_at: runData.finished_at,
        status: runData.status,
        total_points: runData.total_points,
        total_errors: runData.total_errors,
        app_version: runData.app_version
      }])
      .select()
      .single();

    if (runError) throw runError;

    // 2. Inserir os Scores associados à Run
    if (scoresData && scoresData.length > 0) {
      const scoresToInsert = scoresData.map(score => ({
        user_id: runData.user_id,
        run_id: newRun.id,
        points: score.points,
        stage: score.stage,
        created_at: score.created_at || new Date().toISOString()
      }));

      const { error: scoreError } = await supabase
        .from("scores")
        .insert(scoresToInsert);

      if (scoreError) throw scoreError;
    }

    return newRun;
  }

  // Ranking Global: Maior pontuação e desempate por menor tempo
  async getGlobalRanking() {
    const { data, error } = await supabase
      .from("runs")
      .select(`
        id,
        user_id, 
        total_points,
        started_at,
        finished_at,
        profiles ( username )
      `)
      .eq("status", "finished"); // Pega apenas partidas finalizadas

    if (error) throw error;

    // Formatar e calcular o tempo gasto (em milissegundos)
    const formattedRuns = data.map(run => {
      const startTime = new Date(run.started_at).getTime();
      const finishTime = new Date(run.finished_at).getTime();
      const timeSpentMs = finishTime - startTime;

      return {
        run_id: run.id,
        user_id: run.user_id, // Adicionado aqui para o retorno
        username: run.profiles?.username || "Desconhecido",
        total_points: run.total_points,
        time_spent_ms: timeSpentMs,
        // Convertendo para segundos apenas para visualização no front, se desejar:
        time_spent_seconds: Math.round(timeSpentMs / 1000) 
      };
    });

    // Ordenar: 1º Maior total_points (Decrescente), 2º Menor time_spent (Crescente)
    formattedRuns.sort((a, b) => {
      if (b.total_points !== a.total_points) {
        return b.total_points - a.total_points; // Decrescente por pontos
      }
      return a.time_spent_ms - b.time_spent_ms; // Crescente por tempo gasto (desempate)
    });

    return formattedRuns;
  }

  // Runs de um Usuário (Ordem decrescente de criação/início)
  async getUserRuns(userId) {
    const { data, error } = await supabase
      .from("runs")
      .select(`
        id,
        started_at,
        finished_at,
        status,
        total_points,
        total_errors,
        scores ( points, stage )
      `)
      .eq("user_id", userId)
      .order("started_at", { ascending: false });

    if (error) throw error;
    return data;
  }
}

export default new ProfileService();