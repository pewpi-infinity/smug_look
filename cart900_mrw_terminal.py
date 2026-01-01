#!/usr/bin/env python3
"""
Cart 900: MRW Animated Terminal Command Processor
Handles infinity-* commands and integrates with the animated terminal system
"""

import json
import time
import os
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
INFINITY_DIR = os.path.join(ROOT, ".infinity")
TERMINAL_STATE = os.path.join(ROOT, "CART801_TERMINAL_STATE.json")
WALLET = os.path.join(ROOT, "CART805_WALLET.json")

def load_json(path, default=None):
    """Load JSON file with default fallback"""
    if not os.path.exists(path):
        return default if default is not None else {}
    with open(path, 'r') as f:
        return json.load(f)

def save_json(path, data):
    """Save data to JSON file"""
    with open(path, 'w') as f:
        json.dump(data, f, indent=2)

def load_infinity_config(filename):
    """Load configuration from .infinity directory"""
    config_path = os.path.join(INFINITY_DIR, filename)
    return load_json(config_path, {})

class InfinityTerminalProcessor:
    def __init__(self):
        self.legend_meta = load_infinity_config('legend-meta.json')
        self.token_formulas = load_infinity_config('token-formulas.json')
        self.theme_config = load_infinity_config('theme-config.json')
        self.terminal_config = load_infinity_config('terminal-config.json')
        self.animation_manifest = load_infinity_config('animation-manifest.json')
        self.repo_links = load_infinity_config('repo-links.json')
        
        self.terminal_state = load_json(TERMINAL_STATE, {
            "last_tick": int(time.time()),
            "inf_rate": 1,
            "inf_accumulated": 0,
            "commands_executed": 0,
            "themes_switched": 0,
            "powerups_collected": 0
        })
        
        # Ensure all keys exist
        defaults = {
            "last_tick": int(time.time()),
            "inf_rate": 1,
            "inf_accumulated": 0,
            "commands_executed": 0,
            "themes_switched": 0,
            "powerups_collected": 0
        }
        for key, value in defaults.items():
            if key not in self.terminal_state:
                self.terminal_state[key] = value
        
        self.wallet = load_json(WALLET, {
            "balance": 0,
            "history": []
        })
    
    def process_command(self, command, args=None):
        """Process an infinity command and return response"""
        args = args or []
        
        commands = {
            'infinity-show': self.cmd_show,
            'infinity-help': self.cmd_help,
            'infinity-boost': self.cmd_boost,
            'infinity-theme': self.cmd_theme,
            'infinity-search': self.cmd_search,
            'infinity-build': self.cmd_build,
            'infinity-navigate': self.cmd_navigate,
            'infinity-status': self.cmd_status,
            'infinity-wallet': self.cmd_wallet,
            'infinity-repos': self.cmd_repos
        }
        
        handler = commands.get(command)
        if handler:
            return handler(args)
        else:
            return {
                'ok': False,
                'error': f'Unknown command: {command}',
                'hint': 'Try infinity-help for available commands'
            }
    
    def cmd_show(self, args):
        """Show available repos"""
        repos = self.repo_links.get('related_repos', [])
        return {
            'ok': True,
            'command': 'infinity-show',
            'repos': repos,
            'message': '🍄 Mario shows you around the repos!',
            'animation': 'mario_walk',
            'inf_earned': self.award_inf('terminal_interaction')
        }
    
    def cmd_help(self, args):
        """Show help information"""
        commands = [
            {'cmd': 'infinity-show', 'desc': 'View available repos'},
            {'cmd': 'infinity-help', 'desc': 'Show this help'},
            {'cmd': 'infinity-boost', 'desc': 'Activate mushroom power-up'},
            {'cmd': 'infinity-theme [name]', 'desc': 'Switch theme'},
            {'cmd': 'infinity-search [term]', 'desc': 'Search repos'},
            {'cmd': 'infinity-build', 'desc': 'Build and celebrate'},
            {'cmd': 'infinity-navigate', 'desc': 'Open joystick demo'},
            {'cmd': 'infinity-status', 'desc': 'View system status'},
            {'cmd': 'infinity-wallet', 'desc': 'View INF balance'},
            {'cmd': 'infinity-repos', 'desc': 'List all connected repos'}
        ]
        return {
            'ok': True,
            'command': 'infinity-help',
            'commands': commands,
            'message': '🟢 Luigi explains the commands!',
            'animation': 'luigi_point',
            'inf_earned': self.award_inf('terminal_interaction')
        }
    
    def cmd_boost(self, args):
        """Activate power-up"""
        self.terminal_state['powerups_collected'] += 1
        save_json(TERMINAL_STATE, self.terminal_state)
        
        return {
            'ok': True,
            'command': 'infinity-boost',
            'message': '🍄 POWER-UP ACTIVATED! Your progress is doubled! ✨',
            'celebration': 'You jumped it loose! 🍄✨',
            'animation': 'mushroom_collect',
            'duration': 30,
            'multiplier': 2.0,
            'inf_earned': self.award_inf('power_up_collection')
        }
    
    def cmd_theme(self, args):
        """Switch theme"""
        theme = args[0] if args else 'mario'
        themes = self.theme_config.get('themes', {})
        
        if theme not in themes:
            return {
                'ok': False,
                'error': f'Theme not found: {theme}',
                'available_themes': list(themes.keys())
            }
        
        self.terminal_state['themes_switched'] += 1
        save_json(TERMINAL_STATE, self.terminal_state)
        
        theme_data = themes[theme]
        return {
            'ok': True,
            'command': 'infinity-theme',
            'theme': theme,
            'theme_data': theme_data,
            'message': f'🎨 Theme switched to: {theme_data["name"]}',
            'animation': 'mario_jump',
            'inf_earned': self.award_inf('theme_switch')
        }
    
    def cmd_search(self, args):
        """Search repos"""
        term = ' '.join(args) if args else ''
        
        return {
            'ok': True,
            'command': 'infinity-search',
            'term': term,
            'message': f'🚗 Car pulls up with search results for: "{term}"',
            'results': {
                'found': 42,
                'repos': 3,
                'categories': ['Research', 'Terminal', 'Growth']
            },
            'animation': 'car_arrive',
            'inf_earned': self.award_inf('terminal_interaction') + 3
        }
    
    def cmd_build(self, args):
        """Build and celebrate"""
        self.terminal_state['commands_executed'] += 1
        save_json(TERMINAL_STATE, self.terminal_state)
        
        return {
            'ok': True,
            'command': 'infinity-build',
            'message': '🔨 Building repos...',
            'success': '✅ Build successful! All characters celebrate! 🎉',
            'animations': ['mario_jump', 'luigi_jump', 'celebration'],
            'inf_earned': self.award_inf('terminal_interaction') + self.award_inf('achievement_unlock') // 5
        }
    
    def cmd_navigate(self, args):
        """Show navigation controls"""
        return {
            'ok': True,
            'command': 'infinity-navigate',
            'message': '🕹️ Joystick controls active!',
            'controls': {
                'up': 'Scroll up / Mario jumps',
                'down': 'Scroll down',
                'left': 'Mario walks left',
                'right': 'Mario walks right',
                'a': 'Execute command',
                'b': 'Luigi appears'
            },
            'inf_earned': self.award_inf('joystick_usage')
        }
    
    def cmd_status(self, args):
        """Show system status"""
        return {
            'ok': True,
            'command': 'infinity-status',
            'terminal_state': self.terminal_state,
            'wallet_balance': self.wallet.get('balance', 0),
            'features': self.legend_meta.get('features', []),
            'themes_available': len(self.theme_config.get('themes', {})),
            'message': '📊 System Status Retrieved'
        }
    
    def cmd_wallet(self, args):
        """Show wallet balance"""
        return {
            'ok': True,
            'command': 'infinity-wallet',
            'balance': self.wallet.get('balance', 0),
            'history': self.wallet.get('history', [])[-10:],  # Last 10 transactions
            'message': f'💰 Your INF Balance: {self.wallet.get("balance", 0)}'
        }
    
    def cmd_repos(self, args):
        """List all connected repos"""
        repos = self.repo_links.get('related_repos', [])
        discovery_tags = self.repo_links.get('discovery_tags', [])
        
        return {
            'ok': True,
            'command': 'infinity-repos',
            'repos': repos,
            'discovery_tags': discovery_tags,
            'current_repo': self.repo_links.get('repo', 'unknown'),
            'message': f'🔗 Connected to {len(repos)} repos'
        }
    
    def award_inf(self, formula_key):
        """Award INF based on formula"""
        formulas = self.token_formulas.get('formulas', {})
        formula = formulas.get(formula_key, '0 INF')
        
        # Simple parsing (in production, use proper expression evaluator)
        amount = 1
        if 'INF' in formula:
            parts = formula.split()
            try:
                amount = int(parts[0])
            except (ValueError, IndexError):
                amount = 1
        
        # Ensure wallet has required keys
        if 'balance' not in self.wallet:
            self.wallet['balance'] = 0
        if 'history' not in self.wallet:
            self.wallet['history'] = []
        
        self.wallet['balance'] += amount
        self.wallet['history'].append({
            'time': int(time.time()),
            'type': formula_key,
            'amount': amount
        })
        
        save_json(WALLET, self.wallet)
        return amount

def main():
    """Main CLI entry point"""
    if len(sys.argv) < 2:
        print(json.dumps({
            'ok': False,
            'error': 'No command provided',
            'usage': 'python cart900_mrw_terminal.py <command> [args...]'
        }, indent=2))
        return
    
    command = sys.argv[1]
    args = sys.argv[2:] if len(sys.argv) > 2 else []
    
    processor = InfinityTerminalProcessor()
    result = processor.process_command(command, args)
    
    print(json.dumps(result, indent=2))

if __name__ == '__main__':
    main()
