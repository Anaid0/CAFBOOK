import { Media_types } from "../models/Media_types";
export interface Media_typesPort{
     createMedia_type(media_type: Omit<Media_types,"media_type_id">): Promise<number>;
     updateMedia_type(media_type_id:number, media_type:Partial<Media_types>):Promise<boolean>;
     deleteMedia_type(media_type_id:number): Promise<boolean>;
     getMedia_typeById(media_type_id:number): Promise<Media_types | null>;
     getMedia_typeByDescription(description: string): Promise<Media_types | null>;
     getAllMedia_types(): Promise <Media_types[]>;
}