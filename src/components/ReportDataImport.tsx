
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Upload, Database, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const ReportDataImport = () => {
  const [activeTab, setActiveTab] = useState('csv');
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<{
    success: number;
    failed: number;
    errors: string[];
  } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jsonData, setJsonData] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleCSVImport = async () => {
    if (!selectedFile || !selectedTemplate || !user) return;

    setIsImporting(true);
    setImportResults(null);

    try {
      const text = await selectedFile.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const results = {
        success: 0,
        failed: 0,
        errors: [] as string[]
      };

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = lines[i].split(',').map(v => v.trim());
        
        try {
          // Basic CSV parsing - in production, you'd want more robust parsing
          const playerName = values[headers.indexOf('player_name')] || values[0];
          const rating = parseFloat(values[headers.indexOf('rating')] || values[1]) || 0;
          const notes = values[headers.indexOf('notes')] || values[2] || '';

          // Find or create player (simplified - in production, you'd need better player matching)
          const { data: players } = await supabase
            .from('players')
            .select('id')
            .ilike('name', `%${playerName}%`)
            .limit(1);

          if (!players || players.length === 0) {
            results.failed++;
            results.errors.push(`Player not found: ${playerName}`);
            continue;
          }

          // Create report with basic structure
          const reportData = {
            player_id: players[0].id,
            scout_id: user.id,
            template_id: selectedTemplate,
            status: 'draft',
            sections: JSON.stringify([
              {
                sectionId: 'overall',
                fields: [
                  { fieldId: 'overall_rating', value: rating, notes: notes }
                ]
              }
            ])
          };

          const { error } = await supabase
            .from('reports')
            .insert(reportData);

          if (error) throw error;
          results.success++;
        } catch (error) {
          results.failed++;
          results.errors.push(`Row ${i}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      setImportResults(results);
      toast({
        title: "Import Complete",
        description: `${results.success} reports imported successfully, ${results.failed} failed.`,
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleJSONImport = async () => {
    if (!jsonData || !selectedTemplate || !user) return;

    setIsImporting(true);
    setImportResults(null);

    try {
      const data = JSON.parse(jsonData);
      const reports = Array.isArray(data) ? data : [data];
      
      const results = {
        success: 0,
        failed: 0,
        errors: [] as string[]
      };

      for (const reportData of reports) {
        try {
          // Basic validation
          if (!reportData.player_name && !reportData.player_id) {
            throw new Error('Missing player identifier');
          }

          let playerId = reportData.player_id;
          
          if (!playerId && reportData.player_name) {
            const { data: players } = await supabase
              .from('players')
              .select('id')
              .ilike('name', `%${reportData.player_name}%`)
              .limit(1);

            if (!players || players.length === 0) {
              throw new Error(`Player not found: ${reportData.player_name}`);
            }
            playerId = players[0].id;
          }

          const newReport = {
            player_id: playerId,
            scout_id: user.id,
            template_id: selectedTemplate,
            status: reportData.status || 'draft',
            sections: JSON.stringify(reportData.sections || []),
            match_context: reportData.match_context ? JSON.stringify(reportData.match_context) : null,
            tags: reportData.tags || []
          };

          const { error } = await supabase
            .from('reports')
            .insert(newReport);

          if (error) throw error;
          results.success++;
        } catch (error) {
          results.failed++;
          results.errors.push(error instanceof Error ? error.message : 'Unknown error');
        }
      }

      setImportResults(results);
      toast({
        title: "Import Complete",
        description: `${results.success} reports imported successfully, ${results.failed} failed.`,
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Invalid JSON format",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Reports
          </CardTitle>
          <CardDescription>
            Import your existing scouting reports using various data formats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="template-select">Select Report Template</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template for imported reports" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic-template">Basic Template</SelectItem>
                  <SelectItem value="detailed-template">Detailed Template</SelectItem>
                  <SelectItem value="match-template">Match Report Template</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="csv" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  CSV Upload
                </TabsTrigger>
                <TabsTrigger value="json" className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  JSON Import
                </TabsTrigger>
                <TabsTrigger value="api" className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  API Connect
                </TabsTrigger>
              </TabsList>

              <TabsContent value="csv" className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    CSV should include columns: player_name, rating, notes (or custom column names)
                  </AlertDescription>
                </Alert>
                
                <div>
                  <Label htmlFor="csv-file">Choose CSV File</Label>
                  <Input
                    id="csv-file"
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                  />
                </div>

                {selectedFile && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{selectedFile.name}</Badge>
                    <Badge variant="secondary">{(selectedFile.size / 1024).toFixed(1)} KB</Badge>
                  </div>
                )}

                <Button 
                  onClick={handleCSVImport}
                  disabled={!selectedFile || !selectedTemplate || isImporting}
                  className="w-full"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Import CSV
                    </>
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="json" className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Paste JSON data with report objects. Each report should include player_name or player_id.
                  </AlertDescription>
                </Alert>

                <div>
                  <Label htmlFor="json-data">JSON Data</Label>
                  <Textarea
                    id="json-data"
                    placeholder={`[
  {
    "player_name": "John Doe",
    "status": "draft",
    "sections": [...],
    "match_context": {...},
    "tags": ["urgent"]
  }
]`}
                    value={jsonData}
                    onChange={(e) => setJsonData(e.target.value)}
                    rows={8}
                  />
                </div>

                <Button 
                  onClick={handleJSONImport}
                  disabled={!jsonData || !selectedTemplate || isImporting}
                  className="w-full"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Database className="mr-2 h-4 w-4" />
                      Import JSON
                    </>
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="api" className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    API integration feature coming soon. Connect your existing scouting platforms.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="api-endpoint">API Endpoint</Label>
                    <Input
                      id="api-endpoint"
                      placeholder="https://api.yourplatform.com/reports"
                      disabled
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="api-key">API Key</Label>
                    <Input
                      id="api-key"
                      type="password"
                      placeholder="Your API key"
                      disabled
                    />
                  </div>

                  <Button disabled className="w-full">
                    <Database className="mr-2 h-4 w-4" />
                    Connect API (Coming Soon)
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            {importResults && (
              <Alert className={importResults.success > 0 ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="flex gap-4">
                      <Badge variant="outline" className="bg-green-100">
                        {importResults.success} Successful
                      </Badge>
                      <Badge variant="outline" className="bg-red-100">
                        {importResults.failed} Failed
                      </Badge>
                    </div>
                    {importResults.errors.length > 0 && (
                      <div>
                        <p className="font-medium mb-1">Errors:</p>
                        <ul className="text-sm space-y-1">
                          {importResults.errors.slice(0, 5).map((error, index) => (
                            <li key={index} className="text-red-600">• {error}</li>
                          ))}
                          {importResults.errors.length > 5 && (
                            <li className="text-gray-500">... and {importResults.errors.length - 5} more</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportDataImport;
