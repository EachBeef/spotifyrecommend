import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBackendAPI } from '@/hooks/useBackendAPI';
import { useSpotify } from '@/hooks/useSpotify';
import { API_ENDPOINTS } from '@/lib/config';
import { Loader2, Music, Search, ExternalLink } from 'lucide-react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [limit, setLimit] = useState('5');

  // Hooks
  const { track, loading: spotifyLoading, error: spotifyError, searchTrack, clearTrack } = useSpotify();
  const contentBased = useBackendAPI(track ? API_ENDPOINTS.contentBased(track.name) : '');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await searchTrack(searchQuery);
    
    if (result) {
      // Buscar recomendações automaticamente
      setTimeout(() => {
        handleGetRecommendations();
      }, 500);
    }
  };

  const handleGetRecommendations = async () => {
    if (track) {
      await contentBased.request();
    }
  };

  const handleClear = () => {
    clearTrack();
    setSearchQuery('');
    contentBased.data ? null : null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Music className="text-green-600" size={40} />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Recomendador Musical
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Busque uma música no Spotify e receba recomendações personalizadas
          </p>
        </div>

        {/* Seção de Busca */}
        <Card className="mb-8 border-2 border-green-200 dark:border-green-900">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
            <CardTitle className="flex items-center gap-2">
              <Search size={24} />
              Buscar Música no Spotify
            </CardTitle>
            <CardDescription>
              Digite o nome da música ou artista para começar
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Nome da Música</Label>
                <div className="flex gap-2">
                  <Input
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ex: Blinding Lights, The Weeknd"
                    disabled={spotifyLoading}
                  />
                  <Button 
                    type="submit" 
                    disabled={spotifyLoading || !searchQuery.trim()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {spotifyLoading ? (
                      <>
                        <Loader2 className="mr-2 animate-spin" size={16} />
                        Buscando...
                      </>
                    ) : (
                      <>
                        <Search size={16} className="mr-2" />
                        Buscar
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {spotifyError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-300 text-sm">
                  ❌ {spotifyError}
                </div>
              )}

              {/* Resultado do Spotify */}
              {track && (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex gap-4 items-start">
                    {track.image && (
                      <img 
                        src={track.image} 
                        alt={track.name}
                        className="w-24 h-24 rounded-lg shadow-md object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{track.name}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">{track.artist}</p>
                      <a 
                        href={track.spotify_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium"
                      >
                        Abrir no Spotify
                        <ExternalLink size={16} />
                      </a>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={handleClear}
                      className="text-red-600 hover:text-red-700 border-red-200"
                    >
                      Limpar
                    </Button>
                  </div>
                </div>
              )}

              {track && (
                <div className="space-y-2">
                  <Label htmlFor="limit">Número de Recomendações</Label>
                  <div className="flex gap-2">
                    <Input
                      id="limit"
                      type="number"
                      value={limit}
                      onChange={(e) => setLimit(e.target.value)}
                      min="1"
                      max="20"
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleGetRecommendations}
                      disabled={contentBased.loading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {contentBased.loading ? (
                        <>
                          <Loader2 className="mr-2 animate-spin" size={16} />
                          Carregando...
                        </>
                      ) : (
                        'Obter Recomendações'
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Recomendações */}
        {contentBased.data && (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              🎵 Recomendações para você
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contentBased.data.recommendations?.map((rec: any, idx: number) => (
                <Card 
                  key={idx} 
                  className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500 dark:border-l-purple-400"
                >
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">{rec.title}</CardTitle>
                    <CardDescription className="line-clamp-1">{rec.artist}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Gênero:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{rec.genre}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Ano:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{rec.year}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Popularidade:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-400 to-blue-500"
                            style={{ width: `${(rec.popularity / 100) * 100}%` }}
                          />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{rec.popularity}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {contentBased.error && (
          <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
            <CardContent className="pt-6">
              <div className="text-red-700 dark:text-red-300">
                ❌ Erro ao buscar recomendações: {contentBased.error}
              </div>
            </CardContent>
          </Card>
        )}

        {!track && (
          <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
            <CardHeader>
              <CardTitle className="text-lg">Como funciona</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <p>
                <strong>1.</strong> Digite o nome de uma música ou artista no campo acima
              </p>
              <p>
                <strong>2.</strong> Clique em "Buscar" para encontrar a música no Spotify
              </p>
              <p>
                <strong>3.</strong> Ajuste o número de recomendações desejadas
              </p>
              <p>
                <strong>4.</strong> Clique em "Obter Recomendações" para receber sugestões personalizadas
              </p>
              <p>
                <strong>5.</strong> As recomendações são baseadas em características musicais como BPM, energia, danceabilidade e mais
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
