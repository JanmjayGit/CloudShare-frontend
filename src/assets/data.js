import { Receipt, Files , CreditCard, Upload, LayoutDashboard} from "lucide-react";


export const features = [
    {
        iconName:"ArrowUpCircle",
        iconColor:"text-purple-500",
        title:"Easy file upload",
        description:"Upload your files with a simple drag-and-drop interface or a click to select files from your device."
    },

    {
        iconName:"Shield",
        iconColor:"text-green-500",
        title:"Secure storage",
        description:"Your files are encrypted and stored securely to ensure your privacy and data protection."
    },

    {
        iconName:"Share2",
        iconColor:"text-blue-500",
        title:"File sharing",
        description:"Easily share your files with others using secure links or direct access permissions."
    },

    {
        iconName:"CreditCard",
        iconColor:"text-orange-500",
        title:"Flexible Credits",
        description:"Pay only for what you use with our flexible credit system, allowing you to manage your storage costs effectively."
    },

    {
        iconName:"FileText",
        iconColor:"text-red-500",
        title:"file Management",
        description:"Organize, preview, and manage your files from any device."
    },

    {
        iconName:"Clock",
        iconColor:"text-indigo-500",
        title:"Transaction History",
        description:"Keep track of all your credit purchases and usage with detailed transaction history."
    },

];

export const pricingPalns =[
    {
        name:"Free",
        price:"0",
        description:"Perfect for individuals getting started",
        features:[
            "5 file uploads",
            "Basic file sharing",
            "7-day file retention",
            "Email support"
        ],
        cta:"Get Started",
        highlighted:false
    },

    {
        name:"Premium",
        price:"500",
        description:"Ideal for individuals with larger storage needs",
        features:[
            "1000 file uploads",
            "Advanced file sharing",
            "30-day file retention",
            "Priority email support",
            "File analytics"
        ],
        cta:"Go Premium",
        highlighted:true
    },

    {
        name:"Ultimate",
        price:"2500",
        description:"Best for teams and businesses",
        features:[
            "5000 file uploads",
            "Team sharing capabilities",
            "unlimited file retention",
            "24/7 priority support",
            "Advanced analytics",
            "API access"
        ],
        cta:"Go Ultimate",
        highlighted:false
    }
];

export const testimonials = [
    {
        name:"Sara Johnson",
        role:"Marketing Director",
        company:"Creativeminds Inc.",
        image:"src/assets/Sara.jpg",
        quote:"CloudShare has transformed the way our team collaborates on projects. The secure file sharing and easy access to files from anywhere have significantly improved our productivity.",
        rating:5
    },

    {
        name:"Michael Chan",
        role:"freelance Designer",
        company:"Self-employed",
        image:"src/assets/Michel.jpeg",
        quote:"As a freelance designer, I deal with large files daily. CloudShare's flexible credit system and secure storage have made managing my files hassle-free and cost-effective.",
        rating:5
    },

    {
        name:"Priya Sharma",
        role:"Project Manager",
        company:"TechSolutions Ltd.",
        image:"src/assets/Priya.jpeg",
        quote:"Managing project files has never been easier. CloudShare's intuitive interface and robust features have streamlined our workflow and enhanced team collaboration.",
        rating:4
    }
];
// side menubar options data
export const SIDE_MENU_DATA = [
    {
        id:"01",
        label:"Dashboard",
        icon:LayoutDashboard,
        path:"/dashboard",
    },

    {
        id:"02",
        label:"Upload",
        icon:Upload,
        path:"/upload",
    },

    {
        id:"03",
        label:"My Files",
        icon:Files,
        path:"/my-files",
    },

    {
        id:"04",
        label:"Subscription",
        icon:CreditCard,
        path:"/subscription",
    },

    {
        id:"05",
        label:"Transactions",
        icon:Receipt,
        path:"/transactions",
    }
];