export interface Tag {
    name: string;
    color?: string;
}
export interface Talk {
    id: string;
    text: string;
    title: string;
    description: string;
    selectedDate: any;
    author?: string;
    tags?: Tag[];
    linked?: Talk[];
    height: number;
    image?: string;
    createdAt?: Date;
    status: any[];
    issueType?: IssueType;
}

// export interface Issue {
//     name: IssueType;
//     color: string;
// }

export enum IssueType {
    Epic = 'epic',
    Feature = 'feature',
    Release = 'release',
    Story = 'story',
    Task = 'task',
    Bug = 'bug'
}

export interface Track {
    title: string;
    talks: Talk[];
    id: string;
}

export interface Board {
    title: string;
    tracks: Track[];
}