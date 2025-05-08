
import { useState } from "react";
import { ReportSection, ReportField, ReportFieldType, RatingSystem } from "@/types/report";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import FieldEditor from "@/components/FieldEditor";
import { Plus, ChevronUp, ChevronDown, Trash2, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplateSectionEditorProps {
  sections: ReportSection[];
  onUpdate: (sections: ReportSection[]) => void;
  defaultRatingSystem?: RatingSystem;
}

const createNewSection = (): ReportSection => ({
  id: `section-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  title: "New Section",
  fields: [],
  optional: false
});

const createNewField = (sectionId: string, defaultRatingSystem?: RatingSystem): ReportField => {
  const newField: ReportField = {
    id: `field-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    label: "New Field",
    type: "text",
    required: false
  };
  
  // If the field is a rating and there's a default rating system, use it
  if (newField.type === "rating" && defaultRatingSystem) {
    newField.ratingSystem = { ...defaultRatingSystem };
  }
  
  return newField;
};

const TemplateSectionEditor = ({ sections, onUpdate, defaultRatingSystem }: TemplateSectionEditorProps) => {
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(
    sections.length ? sections[0].id : null
  );
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);
  const [draggedFieldId, setDraggedFieldId] = useState<string | null>(null);

  const handleAddSection = () => {
    const newSection = createNewSection();
    const updatedSections = [...sections, newSection];
    onUpdate(updatedSections);
    setExpandedSectionId(newSection.id);
  };

  const handleDeleteSection = (sectionId: string) => {
    const updatedSections = sections.filter(section => section.id !== sectionId);
    onUpdate(updatedSections);
    
    if (expandedSectionId === sectionId) {
      setExpandedSectionId(updatedSections.length ? updatedSections[0].id : null);
    }
  };

  const handleUpdateSection = (updatedSection: ReportSection) => {
    const updatedSections = sections.map(section => 
      section.id === updatedSection.id ? updatedSection : section
    );
    onUpdate(updatedSections);
  };

  const handleAddField = (sectionId: string) => {
    const newField = createNewField(sectionId, defaultRatingSystem);
    
    const updatedSections = sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          fields: [...section.fields, newField]
        };
      }
      return section;
    });
    
    onUpdate(updatedSections);
    setEditingFieldId(newField.id);
  };

  const handleDeleteField = (sectionId: string, fieldId: string) => {
    const updatedSections = sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          fields: section.fields.filter(field => field.id !== fieldId)
        };
      }
      return section;
    });
    
    onUpdate(updatedSections);
    
    if (editingFieldId === fieldId) {
      setEditingFieldId(null);
    }
  };

  const handleUpdateField = (sectionId: string, updatedField: ReportField) => {
    const updatedSections = sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          fields: section.fields.map(field => 
            field.id === updatedField.id ? updatedField : field
          )
        };
      }
      return section;
    });
    
    onUpdate(updatedSections);
  };

  const handleMoveSectionUp = (index: number) => {
    if (index === 0) return;
    
    const updatedSections = [...sections];
    const temp = updatedSections[index];
    updatedSections[index] = updatedSections[index - 1];
    updatedSections[index - 1] = temp;
    
    onUpdate(updatedSections);
  };

  const handleMoveSectionDown = (index: number) => {
    if (index === sections.length - 1) return;
    
    const updatedSections = [...sections];
    const temp = updatedSections[index];
    updatedSections[index] = updatedSections[index + 1];
    updatedSections[index + 1] = temp;
    
    onUpdate(updatedSections);
  };

  const handleMoveFieldUp = (sectionId: string, index: number) => {
    if (index === 0) return;
    
    const updatedSections = sections.map(section => {
      if (section.id === sectionId) {
        const updatedFields = [...section.fields];
        const temp = updatedFields[index];
        updatedFields[index] = updatedFields[index - 1];
        updatedFields[index - 1] = temp;
        
        return {
          ...section,
          fields: updatedFields
        };
      }
      return section;
    });
    
    onUpdate(updatedSections);
  };

  const handleMoveFieldDown = (sectionId: string, index: number) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section || index === section.fields.length - 1) return;
    
    const updatedSections = sections.map(section => {
      if (section.id === sectionId) {
        const updatedFields = [...section.fields];
        const temp = updatedFields[index];
        updatedFields[index] = updatedFields[index + 1];
        updatedFields[index + 1] = temp;
        
        return {
          ...section,
          fields: updatedFields
        };
      }
      return section;
    });
    
    onUpdate(updatedSections);
  };

  return (
    <div className="space-y-4">
      {sections.map((section, sectionIndex) => (
        <Card 
          key={section.id}
          className={cn(
            "border",
            expandedSectionId === section.id ? "border-primary/50" : "",
            draggedSectionId === section.id ? "opacity-50" : ""
          )}
        >
          <CardHeader className="py-3 flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center space-x-2 w-full">
              <div
                className="cursor-move p-1 hover:bg-muted rounded"
                draggable
                onDragStart={() => setDraggedSectionId(section.id)}
                onDragEnd={() => setDraggedSectionId(null)}
              >
                <GripVertical size={16} className="text-muted-foreground" />
              </div>
              
              <Input
                value={section.title}
                onChange={(e) => handleUpdateSection({ ...section, title: e.target.value })}
                className="text-base font-medium border-0 bg-transparent focus-visible:ring-0 p-0 h-auto"
              />
              
              <div className="flex items-center space-x-2 ml-auto">
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => handleMoveSectionUp(sectionIndex)}
                    disabled={sectionIndex === 0}
                  >
                    <ChevronUp size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => handleMoveSectionDown(sectionIndex)}
                    disabled={sectionIndex === sections.length - 1}
                  >
                    <ChevronDown size={16} />
                  </Button>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  onClick={() => handleDeleteSection(section.id)}
                >
                  <Trash2 size={16} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8"
                  onClick={() => {
                    setExpandedSectionId(
                      expandedSectionId === section.id ? null : section.id
                    );
                  }}
                >
                  {expandedSectionId === section.id ? "Collapse" : "Expand"}
                </Button>
              </div>
            </div>
          </CardHeader>
          
          {expandedSectionId === section.id && (
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`section-optional-${section.id}`}
                    checked={section.optional}
                    onCheckedChange={(checked) => {
                      handleUpdateSection({ 
                        ...section, 
                        optional: !!checked 
                      });
                    }}
                  />
                  <label 
                    htmlFor={`section-optional-${section.id}`}
                    className="text-sm"
                  >
                    Optional section
                  </label>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Fields</div>
                  
                  <div className="space-y-2">
                    {section.fields.map((field, fieldIndex) => (
                      <div 
                        key={field.id}
                        className={cn(
                          "border rounded-md p-3 bg-card",
                          editingFieldId === field.id ? "border-primary/50" : "",
                          draggedFieldId === field.id ? "opacity-50" : ""
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div 
                            className="flex items-center space-x-2 cursor-move"
                            draggable
                            onDragStart={() => setDraggedFieldId(field.id)}
                            onDragEnd={() => setDraggedFieldId(null)}
                          >
                            <GripVertical size={16} className="text-muted-foreground" />
                            <div>
                              <div className="font-medium">{field.label}</div>
                              <div className="text-xs text-muted-foreground">
                                Type: {field.type}
                                {field.required && " • Required"}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => handleMoveFieldUp(section.id, fieldIndex)}
                              disabled={fieldIndex === 0}
                            >
                              <ChevronUp size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => handleMoveFieldDown(section.id, fieldIndex)}
                              disabled={fieldIndex === section.fields.length - 1}
                            >
                              <ChevronDown size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 p-0 px-2"
                              onClick={() => setEditingFieldId(
                                editingFieldId === field.id ? null : field.id
                              )}
                            >
                              {editingFieldId === field.id ? "Done" : "Edit"}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteField(section.id, field.id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                        
                        {editingFieldId === field.id && (
                          <div className="mt-3 pt-3 border-t">
                            <FieldEditor
                              field={field}
                              onUpdate={(updatedField) => {
                                handleUpdateField(section.id, updatedField);
                              }}
                              defaultRatingSystem={defaultRatingSystem}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => handleAddField(section.id)}
                  >
                    <Plus size={16} className="mr-1" />
                    Add Field
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
      
      <Button 
        variant="outline" 
        className="w-full"
        onClick={handleAddSection}
      >
        <Plus size={16} className="mr-1" />
        Add Section
      </Button>
    </div>
  );
};

export default TemplateSectionEditor;
