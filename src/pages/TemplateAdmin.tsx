
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Plus, Save, ArrowLeft, Copy, Trash2 } from "lucide-react";
import { mockTemplates } from "@/data/mockTemplates";
import { ReportTemplate, DEFAULT_RATING_SYSTEMS, RatingSystem, RatingSystemType } from "@/types/report";
import TemplateSectionEditor from "@/components/TemplateSectionEditor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import RatingOptionsEditor from "@/components/RatingOptionsEditor";

const TemplateAdmin = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<ReportTemplate[]>(mockTemplates);
  const [currentTemplateId, setCurrentTemplateId] = useState<string>(
    templates[0]?.id || ""
  );
  const [isEditing, setIsEditing] = useState(false);
  
  const currentTemplate = templates.find(t => t.id === currentTemplateId);
  
  const handleCreateTemplate = () => {
    const newTemplate: ReportTemplate = {
      id: `template-${Date.now()}`,
      name: "New Template",
      description: "Description of the new template",
      sections: []
    };
    
    setTemplates([...templates, newTemplate]);
    setCurrentTemplateId(newTemplate.id);
    setIsEditing(true);
  };
  
  const handleCloneTemplate = () => {
    if (!currentTemplate) return;
    
    const clonedTemplate: ReportTemplate = {
      ...currentTemplate,
      id: `template-${Date.now()}`,
      name: `${currentTemplate.name} (Copy)`,
      defaultTemplate: false
    };
    
    setTemplates([...templates, clonedTemplate]);
    setCurrentTemplateId(clonedTemplate.id);
    setIsEditing(true);
  };
  
  const handleDeleteTemplate = () => {
    if (!currentTemplate) return;
    if (templates.length === 1) {
      toast({
        title: "Cannot Delete",
        description: "You must have at least one template.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedTemplates = templates.filter(t => t.id !== currentTemplateId);
    setTemplates(updatedTemplates);
    setCurrentTemplateId(updatedTemplates[0].id);
  };
  
  const handleUpdateTemplate = (updatedTemplate: ReportTemplate) => {
    setTemplates(templates.map(t => 
      t.id === updatedTemplate.id ? updatedTemplate : t
    ));
  };
  
  const handleSaveChanges = () => {
    // In a real app, this would save to a database
    console.log("Saving templates:", templates);
    
    toast({
      title: "Templates Saved",
      description: "Your template changes have been saved.",
    });
    
    // Here we would update our mock data
    // mockTemplates = [...templates];
  };
  
  const handleNameChange = (name: string) => {
    if (!currentTemplate) return;
    handleUpdateTemplate({...currentTemplate, name});
  };
  
  const handleDescriptionChange = (description: string) => {
    if (!currentTemplate) return;
    handleUpdateTemplate({...currentTemplate, description});
  };
  
  const handleUpdateSections = (sections: any) => {
    if (!currentTemplate) return;
    handleUpdateTemplate({...currentTemplate, sections});
  };

  const handleDefaultRatingSystemTypeChange = (ratingType: RatingSystemType) => {
    if (!currentTemplate) return;
    handleUpdateTemplate({
      ...currentTemplate,
      defaultRatingSystem: DEFAULT_RATING_SYSTEMS[ratingType]
    });
  };
  
  const handleDefaultRatingSystemUpdate = (ratingSystem: RatingSystem) => {
    if (!currentTemplate) return;
    handleUpdateTemplate({
      ...currentTemplate,
      defaultRatingSystem: ratingSystem
    });
  };

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Button>
        
        <Button onClick={handleSaveChanges} className="gap-2">
          <Save size={16} />
          Save All Changes
        </Button>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Template Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Templates</CardTitle>
              <CardDescription>
                Manage your report templates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                {templates.map(template => (
                  <Button
                    key={template.id}
                    variant={currentTemplateId === template.id ? "default" : "ghost"}
                    className="w-full justify-start font-normal"
                    onClick={() => setCurrentTemplateId(template.id)}
                  >
                    {template.name}
                    {template.defaultTemplate && (
                      <span className="ml-2 text-xs bg-primary/20 text-primary px-1.5 rounded-full">
                        Default
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleCreateTemplate}
                className="gap-1"
              >
                <Plus size={16} />
                New
              </Button>
              <div className="space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleCloneTemplate}
                  className="gap-1"
                  disabled={!currentTemplate}
                >
                  <Copy size={16} />
                  Clone
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleDeleteTemplate}
                  className="gap-1 text-destructive hover:text-destructive"
                  disabled={!currentTemplate || templates.length <= 1}
                >
                  <Trash2 size={16} />
                  Delete
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        <div className="lg:col-span-3">
          {currentTemplate && (
            <Card>
              <CardHeader>
                <div className="space-y-2">
                  <Input
                    value={currentTemplate.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="text-xl font-bold"
                  />
                  <Textarea
                    value={currentTemplate.description}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                    className="resize-none text-sm text-muted-foreground"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="sections" className="w-full">
                  <TabsList>
                    <TabsTrigger value="sections">Sections</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>
                  <TabsContent value="sections" className="space-y-4 pt-4">
                    <TemplateSectionEditor
                      sections={currentTemplate.sections}
                      onUpdate={handleUpdateSections}
                      defaultRatingSystem={currentTemplate.defaultRatingSystem}
                    />
                  </TabsContent>
                  <TabsContent value="settings" className="space-y-4 pt-4">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="defaultTemplate"
                          checked={!!currentTemplate.defaultTemplate}
                          onChange={(e) => {
                            // Only one template can be default
                            if (e.target.checked) {
                              // Unset default on all templates
                              const updatedTemplates = templates.map(t => ({
                                ...t,
                                defaultTemplate: false
                              }));
                              
                              // Set current as default
                              const updatedCurrentTemplate = {
                                ...currentTemplate,
                                defaultTemplate: true
                              };
                              
                              // Update templates array
                              setTemplates(
                                updatedTemplates.map(t => 
                                  t.id === currentTemplateId ? updatedCurrentTemplate : t
                                )
                              );
                            } else {
                              handleUpdateTemplate({
                                ...currentTemplate,
                                defaultTemplate: false
                              });
                            }
                          }}
                        />
                        <label htmlFor="defaultTemplate">Set as default template</label>
                      </div>

                      <Separator className="my-4" />
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Default Rating System</h3>
                        <p className="text-sm text-muted-foreground">
                          Set a default rating system for all rating fields in this template
                        </p>
                        
                        <div className="space-y-2">
                          <Label htmlFor="rating-system">Rating System Type</Label>
                          <Select 
                            value={currentTemplate.defaultRatingSystem?.type || "numeric-1-10"} 
                            onValueChange={(value) => handleDefaultRatingSystemTypeChange(value as RatingSystemType)}
                          >
                            <SelectTrigger id="default-rating-system">
                              <SelectValue placeholder="Select rating system" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="numeric-1-5">Numeric (1-5)</SelectItem>
                              <SelectItem value="numeric-1-10">Numeric (1-10)</SelectItem>
                              <SelectItem value="letter">Letter Grades</SelectItem>
                              <SelectItem value="custom-tags">Custom Tags</SelectItem>
                              <SelectItem value="percentage">Percentage</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {currentTemplate.defaultRatingSystem && currentTemplate.defaultRatingSystem.type !== "percentage" && (
                          <div className="border p-4 rounded-md">
                            <RatingOptionsEditor 
                              ratingSystem={currentTemplate.defaultRatingSystem}
                              onUpdate={handleDefaultRatingSystemUpdate}
                            />
                          </div>
                        )}

                        <div className="mt-2">
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              toast({
                                title: "Rating System Applied",
                                description: "The default rating system will be used for all new rating fields.",
                              });
                            }}
                          >
                            Apply to All Existing Rating Fields
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateAdmin;
